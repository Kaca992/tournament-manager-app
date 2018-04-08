﻿using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionPhases;
using Tournament.Manager.Business.CompetitionPhases.Group;
using Tournament.Manager.Business.DTO;
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

        public List<CompetitionPhaseInfoDTO> GetCompetitionPhaseInfos(int competitionId)
        {
            var phaseInfoSettings = new List<CompetitionPhaseInfoDTO>();
            var phaseInfos = DbContext.CompetitionPhases.Where(x => x.IdCompetition == competitionId).Select(x => new { x.Id, x.CompetitionPhaseInfoType, x.Settings }).ToList();

            foreach(var phaseInfo in phaseInfos)
            {
                if (phaseInfo.CompetitionPhaseInfoType == (int)CompetitionPhaseTypeEnum.Table)
                {
                    var settings = PhaseInfoSettings.DeserializeObject<GroupPhaseSettings>(phaseInfo.Settings);
                    phaseInfoSettings.Add(new CompetitionPhaseInfoDTO() { CompetitionPhaseId = phaseInfo.Id, Settings = settings });
                }

                if (phaseInfo.CompetitionPhaseInfoType == (int)CompetitionPhaseTypeEnum.Knockout)
                {
                    throw new NotImplementedException("This type is not implemented");
                }
            }

            return phaseInfoSettings;
        }

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
            competitionSettings.MatchInfoType = advancedOptions.MatchInfoType;
            competitionSettings.CompetitorPhaseInfoType = advancedOptions.CompetititorInfoType;

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
