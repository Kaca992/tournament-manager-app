using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionInfos;
using Tournament.Manager.Business.CompetitorInfos.Implementations;
using Tournament.Manager.Business.Factories;
using Tournament.Manager.Business.TableGeneration;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.CompetitionImplementationsREAL
{
    public class TableTennisTournament
    {
        public CompetititorInfoTypeEnum CompetitorInfoType => CompetititorInfoTypeEnum.TableTennisTournament;
        public MatchInfoTypeEnum MatchInfoType => MatchInfoTypeEnum.TableTennisTournament;

        public TableTennisTournament()
        {

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
}
