using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.DTO.CompetitionCreation;
using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.Services
{
    public class CompetitorService: BaseService
    {
        public CompetitorService() : base()
        {

        }

        public CompetitorService(Entities dbContext) : base(dbContext)
        {

        }

        public Dictionary<int, Competitor> InsertNewCompetitors(Competition competition, List<CompetitorCreationInfoDTO> competitors)
        {
            Dictionary<int, Competitor> newCompetitors = new Dictionary<int, Competitor>(); 
            foreach (var competitor in competitors)
            {
                var player = new Player();
                player.DisplayName = competitor.Name;
                DbContext.Players.Add(player);

                var dbCompetitor = new Competitor()
                {
                    Player = player,
                    Competition = competition
                };
                DbContext.Competitors.Add(dbCompetitor);
                newCompetitors.Add(competitor.Id, dbCompetitor);
            }

            return newCompetitors;
        }
    }
}
