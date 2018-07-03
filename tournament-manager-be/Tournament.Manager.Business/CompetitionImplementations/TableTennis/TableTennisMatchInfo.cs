using System.Collections.Generic;
using Tournament.Manager.Business.CompetitionConfiguration.MatchInfos;

namespace Tournament.Manager.Business.CompetitionImplementations.TableTennis
{
    public class TableTennisMatchInfo : MatchInfoBase
    {
        public List<string> Sets1 { get; set; }
        public List<string> Sets2 { get; set; }
        public string Result { get; set; }
    }
}
