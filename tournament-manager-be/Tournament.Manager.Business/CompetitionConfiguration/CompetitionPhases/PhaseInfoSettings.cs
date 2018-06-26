﻿using Newtonsoft.Json;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.CompetitionConfiguration.CompetitionPhases
{
    public abstract class PhaseInfoSettings<TMatchIds, TCompetitorAllocation>: PhaseInfoSettings
    {
        /// <summary>
        /// just a lookup for grouping matches in tree or table if many groups
        /// </summary>
        public TMatchIds MatchIds { get; set; }
        /// <summary>
        /// competitiors allocated in groups/tree (ex. list of competitors where each list member is a list of competitors in a group)
        /// </summary>
        public TCompetitorAllocation CompetitorIds { get; set; }

        protected PhaseInfoSettings()
        {

        }

        protected PhaseInfoSettings(string json)
        {
            PopulateObject(json);
        }
    }

    public abstract class PhaseInfoSettings
    {
        public CompetitionPhaseTypeEnum CompetitionPhaseType { get; set; }
        /// <summary>
        /// how the match looks, will be used when JSON parsing from database so we know what to parse back
        /// </summary>
        public MatchInfoTypeEnum MatchInfoType { get; set; }
        /// <summary>
        /// enum for describing competitor phase info (wins, sets, ...)
        /// </summary>
        public CompetititorInfoTypeEnum CompetitorPhaseInfoType { get; set; }

        public string SerializeObject()
        {
            return JsonConvert.SerializeObject(this, Formatting.None,
                            new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
        }

        public void PopulateObject(string json)
        {
            JsonConvert.PopulateObject(json, this);
        }

        public static T DeserializeObject<T>(string json) where T: PhaseInfoSettings
        {
            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}