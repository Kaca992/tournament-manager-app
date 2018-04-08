using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionPhases;

namespace Tournament.Manager.Business.DTO
{
    public class CompetitionPhaseInfoDTO
    {
        public int CompetitionPhaseId { get; set; }
        public PhaseInfoSettings Settings { get; set; }
    }
}
