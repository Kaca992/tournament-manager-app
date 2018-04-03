using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.Manager.Business.DTO.CompetitionCreation
{
    public class CompetitorCreationInfoDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Team { get; set; }
        public int? Ranking { get; set; }
    }
}
