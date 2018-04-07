using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.CompetitionPhases
{
    public abstract class PhaseInfoSettings<TMatchIds, TCompetitorAllocation>: PhaseInfoSettings
    {
        // just a lookup for grouping matches in tree or table if many groups
        public TMatchIds MatchIds { get; set; }
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
        // how the match looks, will be used when JSON parsing from database so we know what to parse back
        public MatchInfoTypeEnum MatchInfoType { get; set; }
        // how the phase looks
        public CompetititorInfoTypeEnum CompetitorPhaseInfoType { get; set; }

        public string SerializeObject()
        {
            return JsonConvert.SerializeObject(this);
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
