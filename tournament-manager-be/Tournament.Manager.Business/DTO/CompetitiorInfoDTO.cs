using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionConfiguration.CompetitionInfos;
using Tournament.Manager.GridUtils;

namespace Tournament.Manager.Business.DTO
{
    public class CompetitiorInfoDTO
    {
        public List<CompetitionInfo> Competitors { get; set; }
        public List<ColumnDefinition> Columns { get; set; }
    }
}
