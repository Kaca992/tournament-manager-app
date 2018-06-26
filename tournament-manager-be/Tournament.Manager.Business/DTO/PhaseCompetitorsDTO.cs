using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitorInfos;
using Tournament.Manager.GridUtils;

namespace Tournament.Manager.Business.DTO
{
    public class PhaseCompetitorsDTO
    {
        public List<object> Competitors { get; set; }
        public List<ColumnDefinition> Columns { get; set; }
        public List<object> Matches { get; set; }
    }
}
