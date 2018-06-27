using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionConfiguration.CompetitionPhases;
using Tournament.Manager.Business.CompetitionConfiguration.CompetitionPhases.Group;
using Tournament.Manager.Business.DTO;
using Tournament.Manager.Business.DTO.CompetitionCreation;
using Tournament.Manager.Business.Factories;
using Tournament.Manager.Business.ScheduleGenerators;
using Tournament.Manager.Common.Enums;
using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.Services
{
    public class CompetitionPhaseService: BaseService
    {
        public CompetitionPhaseService() : base()
        {

        }

        public CompetitionPhaseService(Entities dbContext) : base(dbContext)
        {

        }

        public List<CompetitionPhaseInfoDTO> GetCompetitionPhaseInfos(int competitionId, int competitionPhaseId = -1)
        {
            var phaseInfoSettings = new List<CompetitionPhaseInfoDTO>();
            Func<CompetitionPhase, bool> filter = x => x.IdCompetition == competitionId;
            if (competitionPhaseId != -1)
            {
                filter = x => x.IdCompetition == competitionId && x.Id == competitionPhaseId;
            }

            var phaseInfos = DbContext.CompetitionPhases.Where(filter).Select(x => new { x.Id, x.CompetitionPhaseInfoType, x.Settings }).ToList();

            foreach (var phaseInfo in phaseInfos)
            {
                if (phaseInfo.CompetitionPhaseInfoType == (int)CompetitionPhaseTypeEnum.Table)
                {
                    var settings = PhaseInfoSettings.DeserializeObject<GroupPhaseSettings>(phaseInfo.Settings);
                    var phaseInfoDTO = new CompetitionPhaseInfoDTO() {CompetitionPhaseId = phaseInfo.Id, Settings = settings};
                    phaseInfoDTO.PhaseTableColumns = CompetitionFactory.Instance.GetCompetition(settings.CompetitionType).GetPhaseTableColumns(phaseInfo.Id, settings);
                    phaseInfoSettings.Add(phaseInfoDTO);
                }

                if (phaseInfo.CompetitionPhaseInfoType == (int)CompetitionPhaseTypeEnum.Knockout)
                {
                    throw new NotImplementedException("This type is not implemented");
                }
            }

            return phaseInfoSettings;
        }

        // TODO: works only for existing competition
        public async Task<int> CreateNewCompetitionPhase(int competitionId, int stageId, CompetitionCreationInfoDTO competitionSettings)
        {
            using (var competitorService = new CompetitorService(DbContext))
            {
                var competitionPhase = InsertNewCompetitionPhase(competitionId, stageId, competitionSettings.AdvancedOptions.CompetitionPhaseType);

                var competitorIds = competitionSettings.Competitors.Select(x => x.Id).ToList();
                var competitorsLookup = competitorService.GetCompetitorsLookup(competitionId);
                var competitors = new Dictionary<int, Competitor>();

                foreach(var competitor in competitorsLookup)
                {
                    if (competitorIds.Contains(competitor.Key))
                    {
                        competitors.Add(competitor.Key, competitor.Value);
                    }
                }

                var scheduleGenerator = ScheduleGeneratorFactory.Instance.GetScheduleGenerator(competitionSettings.AdvancedOptions.ScheduleType);
                var matchesByGroup = scheduleGenerator.GenerateSchedule(competitionSettings.CompetitorsAllocation as JArray, competitors, competitionPhase);

                foreach (var matches in matchesByGroup)
                {
                    foreach (var match in matches.Value)
                    {
                        DbContext.Matches.Add(match);
                    }
                }

                await SaveChangesAsync();

                var allCompetitors = new List<Competitor>();
                foreach (var competitor in competitors)
                {
                    allCompetitors.Add(competitor.Value);
                }

                UpdateCompetitionPhaseSettings(competitionPhase, competitionSettings.AdvancedOptions, matchesByGroup, competitionSettings.CompetitorsAllocation as JArray, competitors);
                competitorService.InsertNewCompetitorPhaseInfos(competitionPhase, allCompetitors);
                await SaveChangesAsync();

                return competitionPhase.Id;
            }
        }

        public CompetitionPhase InsertNewCompetitionPhase(int competitionId, int stageId, CompetitionPhaseTypeEnum phaseType)
        {
            return InsertNewCompetitionPhase(DbContext.Competitions.First(x => x.Id == competitionId), stageId, phaseType);
        }

        public CompetitionPhase InsertNewCompetitionPhase(Competition competition, int stageId, CompetitionPhaseTypeEnum phaseType)
        {
            var newPhase = new CompetitionPhase()
            {
                Competition = competition,
                StageId = stageId,
                Settings = "",
                CompetitionPhaseInfoType = (short)phaseType
            };

            DbContext.CompetitionPhases.Add(newPhase);
            return newPhase;
        }

        public void UpdateCompetitionPhaseSettings(CompetitionPhase competitionPhase, CompetitionAdvancedOptionsDTO advancedOptions, Dictionary<int, List<Match>> matches, JArray competitorAllocations, Dictionary<int, Competitor> competitorLookup)
        {
            switch (advancedOptions.CompetitionPhaseType)
            {
                case CompetitionPhaseTypeEnum.Table:
                    updateTableCompetitionPhaseSettings(competitionPhase, advancedOptions, matches, competitorAllocations, competitorLookup);
                    break;
                case CompetitionPhaseTypeEnum.Knockout:
                    throw new NotImplementedException();
                default:
                    throw new Exception("Type not supported");
            }
        }

        public PhaseInfoSettings GetCompetitionPhaseInfoSettings(int competitionPhaseId)
        {
            var phaseInfo = DbContext.CompetitionPhases.Where(x => x.Id == competitionPhaseId).Select(x => new { x.CompetitionPhaseInfoType, x.Settings }).FirstOrDefault();

            if (phaseInfo.CompetitionPhaseInfoType == (int)CompetitionPhaseTypeEnum.Table)
            {
                return PhaseInfoSettings.DeserializeObject<GroupPhaseSettings>(phaseInfo.Settings);
            }

            if (phaseInfo.CompetitionPhaseInfoType == (int)CompetitionPhaseTypeEnum.Knockout)
            {
                throw new NotImplementedException("This type is not implemented");
            }

            return null;
        }

        #region Delete
        public void DeleteAllCompetitionPhases(int competitionId)
        {
            var competitionPhases = DbContext.CompetitionPhases.Where(x => x.IdCompetition == competitionId);
            foreach (var competitionPhase in competitionPhases)
            {
                DbContext.CompetitionPhases.Remove(competitionPhase);
            }
        }

        public void DeleteCompetitionPhase(int competitionId, int competitionPhaseId)
        {
            var competitionPhase = DbContext.CompetitionPhases.FirstOrDefault(x => x.IdCompetition == competitionId && x.Id == competitionPhaseId);
            if (competitionPhase != null)
            {
                DbContext.CompetitionPhases.Remove(competitionPhase);
            }
        }
        #endregion

        #region Update Helpers
        private void updateTableCompetitionPhaseSettings(CompetitionPhase competitionPhase, CompetitionAdvancedOptionsDTO advancedOptions, Dictionary<int, List<Match>> matches, JArray competitorAllocations, Dictionary<int, Competitor> competitorLookup)
        {
            var competitionSettings = new GroupPhaseSettings();
            if (!string.IsNullOrEmpty(competitionPhase.Settings))
            {
                competitionSettings.PopulateObject(competitionPhase.Settings);
            }

            Dictionary<int, List<int>> matchIds = new Dictionary<int, List<int>>();
            foreach (var groupMathces in matches)
            {
                matchIds.Add(groupMathces.Key, new List<int>());
                matchIds[groupMathces.Key].AddRange(groupMathces.Value.Select(x => x.Id));
            }

            competitionSettings.MatchIds = matchIds;
            competitionSettings.CompetitorIds = getCompetitorsGroupedByGroup(competitorAllocations, competitorLookup);
            competitionSettings.CompetitionType = advancedOptions.CompetitionType;

            competitionPhase.Settings = competitionSettings.SerializeObject(); 
        }

        private Dictionary<int, List<int>> getCompetitorsGroupedByGroup(JArray competitorAllocations, Dictionary<int, Competitor> competitorLookup)
        {
            var competitors = new Dictionary<int, List<int>>();
            var compAllocations = getCompetitorAllocations(competitorAllocations);

            int i = 0;
            foreach (var compAllocation in compAllocations)
            {
                competitors.Add(i, new List<int>());
                foreach (var comp in compAllocation)
                {
                    competitors[i].Add(competitorLookup[comp].Id);
                }

                i++;
            }

            return competitors;
        }

        private List<List<int>> getCompetitorAllocations(JArray competitorAllocations)
        {
            return competitorAllocations.ToObject<List<List<int>>>();
        }
        #endregion
    }
}
