using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitorInfos.Attributes;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.CompetitorInfos.Implementations
{
    [CompetitorInfo(CompetititorInfoTypeEnum.TableTennisTournament)]
    public class TableTennisCompetitorInfo : CompetitorInfoBase
    {
        public int? Wins { get; set; }

        public string Sets { get; set; }

        public int? Placement { get; set; }

        public TableTennisCompetitorInfo(CompetititorInfoTypeEnum competitorInfoType) : base(competitorInfoType)
        {
        }
    }
}
