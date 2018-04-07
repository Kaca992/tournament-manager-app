using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.DTO;
using Tournament.Manager.Business.DTO.CompetitionCreation;
using Tournament.Manager.Business.Factories;
using Tournament.Manager.Business.ScheduleGenerators;
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

        public async Task CreateNewCompetition(CompetitionCreationInfoDTO competitionSettings)
        {
            using (var competitorService = new CompetitorService(DbContext))
            using (var competitionPhaseService = new CompetitionPhaseService(DbContext))
            {
                Category category = null;
                Competition competition = new Competition();
                CompetitionPhase competitionPhase;
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


                competitors = competitorService.InsertNewCompetitors(competition, competitionSettings.Competitors);
                competitionPhase = competitionPhaseService.InsertNewCompetitionPhase(competition, 1);

                var scheduleGenerator = ScheduleGeneratorFactory.Instance.GetScheduleGenerator(competitionSettings.AdvancedOptions.ScheduleType);
                var matchesByGroup = scheduleGenerator.GenerateSchedule(competitionSettings.CompetitorsAllocation as JArray, competitors, competitionPhase);

                foreach (var matches in matchesByGroup)
                {
                    foreach (var match in matches.Value)
                    {
                        DbContext.Matches.Add(match);
                    }
                }

                await SaveChangesAsync();

                var allCompetitors = new List<Competitor>();
                foreach (var competitor in competitors)
                {
                    allCompetitors.Add(competitor.Value);
                }

                competitionPhaseService.UpdateCompetitionPhaseSettings(competitionPhase, competitionSettings.AdvancedOptions, matchesByGroup, competitionSettings.CompetitorsAllocation as JArray, competitors);
                competitorService.InsertNewCompetitorPhaseInfos(competitionPhase, allCompetitors);
                await SaveChangesAsync();
                // onda dio sa phase i phaseInfo. Ovdje ce trebat MatchInfo, PhaseInfo definirat i celu tu logiku
            }
        }

        private void addNewCompetition(string competitionName, int categoryId)
        {

        }
    }
}
