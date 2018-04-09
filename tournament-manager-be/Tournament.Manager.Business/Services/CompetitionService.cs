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

        public Competition CreateNewCompetition(CompetitionConfigOptionsDTO options)
        {
                Category category = null;
                Competition competition = new Competition();

                if (options.CreateNewCategory)
                {
                    category = new Category();
                    category.DisplayName = options.CategoryName;
                    DbContext.Categories.Add(category);
                }
                else
                {
                    category = DbContext.Categories.Where(x => x.Id == options.CategoryId).First();
                }

                competition.Category = category;
                competition.DisplayName = options.CompetitionName;
                DbContext.Competitions.Add(competition);

                return competition;
        }

        public async Task<int> CreateNewCompetitionWizard(CompetitionCreationInfoDTO competitionSettings)
        {
            using (var competitorService = new CompetitorService(DbContext))
            using (var competitionPhaseService = new CompetitionPhaseService(DbContext))
            {
                Competition competition = new Competition();
                CompetitionPhase competitionPhase;
                Dictionary<int, Competitor> competitors;

                competition = CreateNewCompetition(competitionSettings.Options);
                competitors = competitorService.InsertNewCompetitors(competition, competitionSettings.Competitors);
                competitionPhase = competitionPhaseService.InsertNewCompetitionPhase(competition, 1, competitionSettings.AdvancedOptions.CompetitionPhaseType);

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

                return competition.Id;
            }
        }
    }
}
