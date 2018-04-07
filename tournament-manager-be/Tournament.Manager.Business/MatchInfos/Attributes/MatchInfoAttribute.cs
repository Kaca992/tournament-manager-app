using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.MatchInfos.Attributes
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
