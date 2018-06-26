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
        /// <summary>
        /// Method that will return mathces grouped by group/knockout leg
        /// </summary>
        /// <param name="competitorAllocations">Json object from FE. Need to map to object coresponding schedule type (ex. for groups/table it will be a list of lists (each list item is a group))</param>
        /// <param name="competitorLookup">Connects competitors from FE(dummy ids) to competitors from database</param>
        /// <param name="competitionPhase">Competiton phase for which we are generating the schedule</param>
        /// <returns></returns>
        Dictionary<int, List<Match>> GenerateSchedule(JArray competitorAllocations, Dictionary<int, Competitor> competitorLookup, CompetitionPhase competitionPhase);
    }
}
