using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.CompetitionConfiguration.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class CompetitionAttribute : Attribute
    {
        public CompetitionTypeEnum CompetitionType { get; set; }

        public CompetitionAttribute(CompetitionTypeEnum competitionType)
        {
            CompetitionType = competitionType;
        }
    }
}
