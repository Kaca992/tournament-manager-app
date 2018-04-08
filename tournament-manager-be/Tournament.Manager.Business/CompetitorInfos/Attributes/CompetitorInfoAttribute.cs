using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.CompetitorInfos.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class CompetitorInfoAttribute : Attribute
    {
        public CompetititorInfoTypeEnum CompetitorInfoType { get; set; }

        public CompetitorInfoAttribute(CompetititorInfoTypeEnum competitorInfoType)
        {
            CompetitorInfoType = competitorInfoType;
        }
    }
}
