using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Tournament.Manager.Common.Enums;
using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.ScheduleGenerators.Table
{
    public abstract class TableGeneratorBase: IScheduleGenerator
    {
        protected ScheduleTypeEnum _scheduleType;
        public ScheduleTypeEnum ScheduleType => _scheduleType;

        public Dictionary<int, List<Match>> GenerateSchedule(JArray competitorAllocations, Dictionary<int, Competitor> competitorLookup, CompetitionPhase competitionPhase)
        {
            return generateScheduleInternal(getCompetitorAllocations(competitorAllocations), competitorLookup, competitionPhase);
        }

        protected TableGeneratorBase(ScheduleTypeEnum scheduleType)
        {
            _scheduleType = scheduleType;
        }

        protected abstract Dictionary<int, List<Match>> generateScheduleInternal(List<List<int>> competitorAllocations, Dictionary<int, Competitor> competitorLookup, CompetitionPhase competitionPhase);

        protected List<List<int>> getCompetitorAllocations(JArray competitorAllocations)
        {
            return competitorAllocations.ToObject<List<List<int>>>();
        }
    }
}
