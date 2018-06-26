using System;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.CompetitionConfiguration.MatchInfos.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class MatchInfoAttribute : Attribute
    {
        public MatchInfoTypeEnum MatchInfoType { get; set; }

        public MatchInfoAttribute(MatchInfoTypeEnum matchInfoType)
        {
            MatchInfoType = matchInfoType;
        }
    }
}
