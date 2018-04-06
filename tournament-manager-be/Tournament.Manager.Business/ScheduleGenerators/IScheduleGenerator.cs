using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Common.Enums;
using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.ScheduleGenerators
{
    public interface IScheduleGenerator
    {
        ScheduleTypeEnum ScheduleType { get; }
        Dictionary<int, List<Match>> GenerateSchedule(JArray competitorAllocations, Dictionary<int, Competitor> competitorLookup, CompetitionPhase competitionPhase);
    }
}
