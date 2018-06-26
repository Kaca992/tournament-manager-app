using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionConfiguration.MatchInfos;
using Tournament.Manager.Business.CompetitionConfiguration.MatchInfos.Attributes;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.MatchInfos.Implementations
{
    [MatchInfo(MatchInfoTypeEnum.TableTennisTournament)]
    public class TableTennisMatchInfo : MatchInfoBase
    {
        public List<string> Sets1 { get; set; }
        public List<string> Sets2 { get; set; }
        public string Result { get; set; }

        public TableTennisMatchInfo(MatchInfoTypeEnum matchInfoType) : base(matchInfoType)
        {

        }
    }
}
