using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionInfos;
using Tournament.Manager.Business.DTO;
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

        public List<CompetitionInfo> GetCompetitors(int competitionId)
        {
            List<CompetitionInfo> infos = new List<CompetitionInfo>();
            var competitors = DbContext.Competitors
                .Include("Player")
                .Where(x => x.IdCompetition == competitionId)
                .Select(x => new { x.Id, x.CompetitionInfo }).ToList();

            foreach(var competitor in competitors)
            {
                var newInfo = new CompetitionInfo();
                newInfo.PopulateObject(competitor.CompetitionInfo);
                newInfo.Id = competitor.Id;

                infos.Add(newInfo);
            }

            return infos.OrderBy(x => x.Id).ToList();
        }

        public Dictionary<int, Competitor> InsertNewCompetitors(int competitionId, List<CompetitorCreationInfoDTO> competitors)
        {
            var competition = DbContext.Competitions.FirstOrDefault(x => x.Id == competitionId);
            return InsertNewCompetitors(competition, competitors);
        }

        public Dictionary<int, Competitor> InsertNewCompetitors(Competition competition, List<CompetitorCreationInfoDTO> competitors)
        {
            Dictionary<int, Competitor> newCompetitors = new Dictionary<int, Competitor>(); 
            foreach (var competitor in competitors)
            {
                var player = new Player();
                player.DisplayName = competitor.Name;
                DbContext.Players.Add(player);

                var competitorInfo = new CompetitionInfo(competitor);
                var dbCompetitor = new Competitor()
                {
                    Player = player,
                    Competition = competition,
                    CompetitionInfo = competitorInfo.SerializeObject()
                };
                DbContext.Competitors.Add(dbCompetitor);
                newCompetitors.Add(competitor.Id, dbCompetitor);
            }

            return newCompetitors;
        }

        public void UpdateCompetitors(int competitionId, List<CompetitorCreationInfoDTO> competitors)
        {
            var existingCompetitors = DbContext.Competitors.Where(x => x.IdCompetition == competitionId).ToList();
            var newCompetitors = new List<CompetitorCreationInfoDTO>();
            var competitorsToRemove = new List<Competitor>();

            foreach(var existingCompetitor in existingCompetitors)
            {
                if(!competitors.Any(x => x.Id == existingCompetitor.Id))
                {
                    competitorsToRemove.Add(existingCompetitor);
                }
                else
                {
                    var competitorInfo = new CompetitionInfo(competitors.FirstOrDefault(x => x.Id == existingCompetitor.Id));
                    existingCompetitor.CompetitionInfo = competitorInfo.SerializeObject();
                    competitors.RemoveAt(competitors.FindIndex(x => x.Id == existingCompetitor.Id));
                }
            }

            DbContext.Competitors.RemoveRange(competitorsToRemove);
            InsertNewCompetitors(DbContext.Competitions.First(x => x.Id == competitionId), competitors);
        }

        public List<CompetitorPhaseInfo> InsertNewCompetitorPhaseInfos(CompetitionPhase competitionPhase, List<Competitor> competitors)
        {
            var newCompetitorPhaseInfos = new List<CompetitorPhaseInfo>();
            foreach(var competitor in competitors)
            {
                var phaseInfo = new CompetitorPhaseInfo()
                {
                    Competitor = competitor,
                    CompetitionPhase = competitionPhase
                };

                DbContext.CompetitorPhaseInfoes.Add(phaseInfo);
                newCompetitorPhaseInfos.Add(phaseInfo);
            }

            return newCompetitorPhaseInfos;
        }

        public List<PhaseCompetitorInfos> GetCompetitorPhaseInfos(int competitionPhaseInfo)
        {
            using (var competitionPhaseService = new CompetitionPhaseService(DbContext))
            {
                //var competitionPhaseSettings = competitionPhaseService.GetCompetitionPhaseInfoSettings(competitionPhaseInfo);
                return DbContext.CompetitorPhaseInfoes.Include("Competitor").Where(x => x.IdCompetitionPhase == competitionPhaseInfo)
                    .Select(x => new PhaseCompetitorInfos() { CompetitorId = x.IdCompetitor, PhaseInfoJSON = x.PhaseInfo, CompetitionInfoJSON = x.Competitor.CompetitionInfo }).ToList();
            }
        }

        public Dictionary<int, Competitor> GetCompetitorsLookup(int competitionId)
        {
            return DbContext.Competitors.Where(x => x.IdCompetition == competitionId).ToDictionary(x => x.Id, x => x);
        }
    }
}
