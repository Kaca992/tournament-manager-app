using System;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.CompetitionConfiguration.CompetitorInfos.Attributes
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
