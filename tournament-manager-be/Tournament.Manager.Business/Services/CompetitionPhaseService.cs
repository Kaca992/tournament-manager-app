using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionPhases;
using Tournament.Manager.Business.CompetitionPhases.Group;
using Tournament.Manager.Business.DTO.CompetitionCreation;
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

        public CompetitionPhase InsertNewCompetitionPhase(Competition competition, int stageId)
        {
            var newPhase = new CompetitionPhase()
            {
                Competition = competition,
                StageId = stageId,
                Settings = ""
            };

            DbContext.CompetitionPhases.Add(newPhase);
            return newPhase;
        }

        public void UpdateCompetitionPhaseSettings(CompetitionPhase competitionPhase, CompetitionAdvancedOptionsDTO advancedOptions, Dictionary<int, List<Match>> matches, List<Competitor> competitors)
        {
            switch (advancedOptions.CompetitionPhaseType)
            {
                case CompetitionPhaseTypeEnum.Table:
                    updateTableCompetitionPhaseSettings(competitionPhase, advancedOptions, matches, competitors);
                    break;
                case CompetitionPhaseTypeEnum.Knockout:
                    throw new NotImplementedException();
                default:
                    throw new Exception("Type not supported");
            }
        }

        private void updateTableCompetitionPhaseSettings(CompetitionPhase competitionPhase, CompetitionAdvancedOptionsDTO advancedOptions, Dictionary<int, List<Match>> matches, List<Competitor> competitors)
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
            competitionSettings.CompetitorIds = competitors.Select(x => x.Id).ToList();
            competitionSettings.MatchInfoType = advancedOptions.MatchInfoType;
            competitionSettings.CompetitorPhaseInfoType = advancedOptions.CompetititorInfoType;

            competitionPhase.Settings = competitionSettings.SerializeObject();
            var test = PhaseInfoSettings.DeserializeObject<GroupPhaseSettings>(competitionPhase.Settings);
        }
    }
}
