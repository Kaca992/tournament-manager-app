using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.MatchInfos;
using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.Services
{
    public class MatchService : BaseService
    {
        public MatchService() : base()
        {

        }

        public MatchService(Entities dbContext) : base(dbContext)
        {

        }

        public void UpdateMatch<T>(int matchId, T matchSettings) where T: MatchInfoBase
        {
            var match = DbContext.Matches.First(x => x.Id == matchId);
            match.MatchInfo = matchSettings.SerializeObject();
        }

        public List<DbMatchInfo<T>> GetMatches<T>(int phaseId) where T : MatchInfoBase
        {
            return DbContext.Matches.Where(x => x.IdCompetitionPhase == phaseId).ToList()
                .Select(x => new DbMatchInfo<T>(x)).ToList();
        }

    }
}
