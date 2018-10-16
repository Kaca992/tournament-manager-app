using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionConfiguration.CompetitionPhases;
using Tournament.Manager.GridUtils;

namespace Tournament.Manager.Business.DTO
{
    public class CompetitionPhaseInfoDTO
    {
        public int CompetitionPhaseId { get; set; }
        public string Name { get; set; }
        public PhaseInfoSettings Settings { get; set; }
        public List<ColumnDefinition> PhaseTableColumns { get; set; }
    }
}
