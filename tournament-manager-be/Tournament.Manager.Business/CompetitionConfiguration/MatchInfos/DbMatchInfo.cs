using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.CompetitionConfiguration.MatchInfos
{
    public class DbMatchInfo<T> where T: MatchInfoBase
    {
        public int MatchId { get; private set; }
        public int PhaseId { get; private set; }
        public int CompetitorId1 { get; private set; }
        public int CompetitorId2 { get; private set; }
        public int Leg { get; set; }

        private T _matchInfo;
        public T MatchInfo
        {
            get => _matchInfo;
            set => _matchInfo = value;
        }

        public DbMatchInfo(Match match)
        {
            MatchId = match.Id;
            PhaseId = match.IdCompetitionPhase;
            CompetitorId1 = match.IdCompetitor1;
            CompetitorId2 = match.IdCompetitor2;
            Leg = match.Id;
            _matchInfo = MatchInfoBase.DeserializeObject<T>(match.MatchInfo);
        }
    }
}
