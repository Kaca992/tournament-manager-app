using Tournament.Manager.Business.CompetitionConfiguration.CompetitorInfos;

namespace Tournament.Manager.Business.CompetitionImplementations.TableTennis
{
    public class TableTennisCompetitorInfo : CompetitorInfoBase
    {
        public int? Wins { get; set; }

        public string Sets { get; set; }

        public int? Placement { get; set; }
    }
}
