using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.DTO;
using Tournament.Manager.Business.DTO.CompetitionCreation;
using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.Services
{
    public class CompetitionService: BaseService
    {
        public CompetitionService() : base()
        {

        }

        public CompetitionService(Entities dbContext) : base(dbContext)
        {

        }

        public void CreateNewCompetition(CompetitionCreationInfoDTO competitionSettings)
        {
            Category category = null;
            Competition competition = new Competition();
            Dictionary<int, Competitor> competitors; 

            if (competitionSettings.Options.CreateNewCategory)
            {
                category = new Category();
                category.DisplayName = competitionSettings.Options.CategoryName;
                DbContext.Categories.Add(category);
            }
            else
            {
                category = DbContext.Categories.Where(x => x.Id == competitionSettings.Options.CategoryId).First();
            }

            competition.Category = category;
            competition.DisplayName = competitionSettings.Options.CompetitionName;
            DbContext.Competitions.Add(competition);

            using (var competitorService = new CompetitorService(DbContext))
            {
                competitors = competitorService.InsertNewCompetitors(competition, competitionSettings.Competitors);
            }
            // dodati igrace u players (players service)
            // dodati novu kategoriju (category service) ak treba
            // napraviti novi competition i dodati competitore
            // onda dio sa phase i phaseInfo. Ovdje ce trebat MatchInfo, PhaseInfo definirat i celu tu logiku
        }

        private void addNewCompetition(string competitionName, int categoryId)
        {

        }
    }
}
