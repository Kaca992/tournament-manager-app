using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.MatchInfos.Attributes;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.MatchInfos.Implementations
{
    [MatchInfo(MatchInfoTypeEnum.TableTennisTournament)]
    public class TableTennisMatchInfo : MatchInfoBase
    {
        public TableTennisMatchInfo(MatchInfoTypeEnum matchInfoType) : base(matchInfoType)
        {
        }
    }
}
