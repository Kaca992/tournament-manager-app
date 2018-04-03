using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.Manager.Business.DTO.CompetitionCreation
{
    public class CompetitionConfigOptionsDTO
    {
        public string CompetitionName { get; set; }
        public bool CreateNewCategory { get; set; }
        public string CategoryName { get; set; }
        public int CategoryId { get; set; }
    }
}
