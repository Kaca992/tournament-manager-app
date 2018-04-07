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
    }
}
