using Tournament.Manager.Business.CompetitionConfiguration.CompetitorInfos.Attributes;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.CompetitionConfiguration.CompetitorInfos.Implementations
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
