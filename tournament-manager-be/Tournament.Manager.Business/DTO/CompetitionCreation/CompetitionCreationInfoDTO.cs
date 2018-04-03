using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.Manager.Business.DTO.CompetitionCreation
{
    public class CompetitionCreationInfoDTO
    {
        public CompetitionConfigOptionsDTO Options { get; set; }
        public CompetitionAdvancedOptionsDTO AdvancedOptions { get; set; }
        public List<CompetitorCreationInfoDTO> Competitors { get; set; }
        public object CompetitorsAllocation { get; set; }
    }
}
