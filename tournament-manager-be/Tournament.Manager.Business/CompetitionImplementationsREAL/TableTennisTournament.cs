using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionInfos;
using Tournament.Manager.Business.CompetitorInfos.Implementations;
using Tournament.Manager.Business.DTO;
using Tournament.Manager.Business.Factories;
using Tournament.Manager.Business.MatchInfos.Implementations;
using Tournament.Manager.Business.TableGeneration;
using Tournament.Manager.Common.Enums;
using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.CompetitionImplementationsREAL
{
    public class TableTennisTournament
    {
        public CompetititorInfoTypeEnum CompetitorInfoType => CompetititorInfoTypeEnum.TableTennisTournament;
        public MatchInfoTypeEnum MatchInfoType => MatchInfoTypeEnum.TableTennisTournament;

        public TableTennisTournament()
        {

        }

        public PhaseCompetitorsDTO GetPhaseCompetitorsDTO(List<PhaseCompetitorInfos> phaseCompetitorInfos, List<Match> matches)
        {
            PhaseCompetitorsDTO phaseCompetitorsDTO = new PhaseCompetitorsDTO();
            phaseCompetitorsDTO.Columns = GetPlayerViewModelColumns();

            var matchesVM = GenerateMatchesViewModel(matches);
            var playersVM = GeneratePlayersViewModel(phaseCompetitorInfos);

            phaseCompetitorsDTO.Competitors = playersVM.ToList<object>();
            phaseCompetitorsDTO.Matches = matchesVM.ToList<object>();

            return phaseCompetitorsDTO;
        }

        public List<TableTennisTournamentMatchesVM> GenerateMatchesViewModel(List<Match> matches)
        {
            List<TableTennisTournamentMatchesVM> matchesVM = new List<TableTennisTournamentMatchesVM>();
            foreach(var match in matches)
            {
                var matchInfo = MatchInfoFactory.Instance.GetMatchInfoType<TableTennisMatchInfo>(MatchInfoType);
                var matchVM = new TableTennisTournamentMatchesVM()
                {
                    MatchId = match.Id,
                    CompetitorId1 = match.IdCompetitor1,
                    CompetitorId2 = match.IdCompetitor2,
                    Leg = match.Leg,
                    Sets1 = matchInfo.Sets1,
                    Sets2 = matchInfo.Sets2,
                    Result = matchInfo.Result
                };

                matchesVM.Add(matchVM);
            }

            return matchesVM;

        }

        public List<TableTennisTournamentPlayerVM> GeneratePlayersViewModel(List<PhaseCompetitorInfos> phaseCompetitorInfos)
        {
            List<TableTennisTournamentPlayerVM> players = new List<TableTennisTournamentPlayerVM>();
            foreach(var phaseCompetitorInfo in phaseCompetitorInfos)
            {
                var phaseInfo = CompetitorInfoFactory.Instance.GetCompetitorInfoType<TableTennisCompetitorInfo>(CompetitorInfoType);
                phaseInfo.PopulateObject(phaseCompetitorInfo.PhaseInfoJSON);

                var competitionInfo = CompetitionInfo.DeserializeObject(phaseCompetitorInfo.CompetitionInfoJSON);
                competitionInfo.Id = phaseCompetitorInfo.CompetitorId;

                players.Add(mapToViewModel(competitionInfo, phaseInfo));
            }

            return players;
        }

        public List<ColumnDefinition> GetPlayerViewModelColumns()
        {
            return ColumnDefinitionFactory.ExtractColumnDefinitions(typeof(TableTennisTournamentPlayerVM));
        }

        protected TableTennisTournamentPlayerVM mapToViewModel(CompetitionInfo competitionInfo, TableTennisCompetitorInfo phaseInfo)
        {
            TableTennisTournamentPlayerVM viewModel = new TableTennisTournamentPlayerVM()
            {
                CompetitorId = competitionInfo.Id,
                DisplayName = competitionInfo.Name,
                Wins = phaseInfo.Wins,
                Sets = phaseInfo.Sets,
                Placement = phaseInfo.Placement
            };

            return viewModel;
        }
    }

    public class TableTennisTournamentPlayerVM
    {
        public int? CompetitorId { get; set; }
        [ColumnDefinition("IGRAČ")]
        public string DisplayName { get; set; }
        public List<string> Matches { get; set; }
        [ColumnDefinition("POB")]
        public int? Wins { get; set; }
        [ColumnDefinition("SET")]
        public int? Sets { get; set; }
        [ColumnDefinition("PLAS.")]
        public int? Placement { get; set; }
    }

    public class TableTennisTournamentMatchesVM
    {
        public int MatchId { get; set; }
        public int CompetitorId1 { get; set; }
        public int CompetitorId2 { get; set; }
        public List<int> Sets1 { get; set; }
        public List<int> Sets2 { get; set; }
        public string Result { get; set; }
        public int Leg { get; set; }
    }
}
