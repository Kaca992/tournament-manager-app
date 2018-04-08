using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.CompetitorInfos
{
    public abstract class CompetitorInfoBase
    {
        public CompetititorInfoTypeEnum CompetitorInfoType { get; set; }

        protected CompetitorInfoBase(CompetititorInfoTypeEnum competitorInfoType)
        {
            CompetitorInfoType = competitorInfoType;
        }
    }
}
