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

        protected TableGeneratorBase(ScheduleTypeEnum scheduleType)
        {
            _scheduleType = scheduleType;
        }

        public Dictionary<int, List<Match>> GenerateSchedule(JArray competitorAllocations, Dictionary<int, Competitor> competitorLookup, CompetitionPhase competitionPhase)
        {
            var competitorTableAllocations = getCompetitorAllocations(competitorAllocations);
            Dictionary<int, List<Match>> matches = new Dictionary<int, List<Match>>();
            int groupKey = 0;
            foreach (var competitorGroup in competitorTableAllocations)
            {
                List<Competitor> competitors = new List<Competitor>();
                foreach (var competitorId in competitorGroup)
                {
                    competitors.Add(competitorLookup[competitorId]);
                }

                matches[groupKey] = new List<Match>();
                matches[groupKey].AddRange(generateScheduleForEachGroup(competitors, competitionPhase));
                groupKey++;
            }

            return matches;
        }

        protected abstract List<Match> generateScheduleForEachGroup(List<Competitor> competitors, CompetitionPhase competitionPhase);

        protected List<List<int>> getCompetitorAllocations(JArray competitorAllocations)
        {
            return competitorAllocations.ToObject<List<List<int>>>();
        }
    }
}
