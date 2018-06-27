using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.DTO.CompetitionCreation
{
    public class CompetitionAdvancedOptionsDTO
    {
        public CompetitionPhaseTypeEnum CompetitionPhaseType { get; set; }
        public ScheduleTypeEnum ScheduleType { get; set; }
        public CompetitionTypeEnum CompetitionType { get; set; }
    }
}
