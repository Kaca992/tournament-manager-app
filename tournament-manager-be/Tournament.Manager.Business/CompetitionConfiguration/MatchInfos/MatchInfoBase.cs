using Newtonsoft.Json;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.CompetitionConfiguration.MatchInfos
{
    public abstract class MatchInfoBase
    {
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
