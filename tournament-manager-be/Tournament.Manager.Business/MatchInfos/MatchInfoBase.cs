using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.MatchInfos
{
    public abstract class MatchInfoBase
    {
        public MatchInfoTypeEnum MatchInfoType { get; set; }

        protected MatchInfoBase(MatchInfoTypeEnum matchInfoType)
        {
            MatchInfoType = matchInfoType;
        }

        public string SerializeObject()
        {
            return JsonConvert.SerializeObject(this, Formatting.None,
                            new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });
        }

        public void PopulateObject(string json)
        {
            if (json == null)
            {
                return;
            }

            JsonConvert.PopulateObject(json, this);
        }

        public static T DeserializeObject<T>(string json) where T : MatchInfoBase
        {
            if (json == null)
            {
                return null;
            }

            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}
