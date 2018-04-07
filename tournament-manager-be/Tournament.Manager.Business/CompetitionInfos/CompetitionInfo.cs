using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.DTO.CompetitionCreation;

namespace Tournament.Manager.Business.CompetitionInfos
{
    // TODO for now all competitions will have same basic info for players
    public class CompetitionInfo
    {
        public string Name { get; set; }
        public string Team { get; set; }
        public int? Ranking { get; set; }

        public CompetitionInfo()
        {

        }

        public CompetitionInfo(CompetitorCreationInfoDTO info)
        {
            Name = info.Name;
            Team = info.Team;
            Ranking = info.Ranking;
        }

        public string SerializeObject()
        {
            return JsonConvert.SerializeObject(this);
        }

        public void PopulateObject(string json)
        {
            JsonConvert.PopulateObject(json, this);
        }

        public static CompetitionInfo DeserializeObject(string json)
        {
            return JsonConvert.DeserializeObject<CompetitionInfo>(json);
        }
    }
}
