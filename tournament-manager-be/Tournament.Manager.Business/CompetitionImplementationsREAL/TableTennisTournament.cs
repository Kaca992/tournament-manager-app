using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionInfos;
using Tournament.Manager.Business.CompetitionPhases.Group;
using Tournament.Manager.Business.CompetitorInfos.Implementations;
using Tournament.Manager.Business.DTO;
using Tournament.Manager.Business.Factories;
using Tournament.Manager.Business.MatchInfos;
using Tournament.Manager.Business.MatchInfos.Implementations;
using Tournament.Manager.Business.Services;
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

        public List<CompetitionPhaseInfoDTO> GetCompetitonPhaseDTO(int competitionId)
        {
            using (var competitionPhaseService = new CompetitionPhaseService())
            using (var competitorService = new CompetitorService(competitionPhaseService.DbContext))
            {
                var phases = competitionPhaseService.GetCompetitionPhaseInfos(competitionId);
                if (phases?.Count() > 0)
                {
                    var firstPhase = phases.First();
                    var firstPhaseId = firstPhase.CompetitionPhaseId;
                    var matches = competitionPhaseService.DbContext.Matches.Where(x => x.IdCompetitionPhase == firstPhaseId).ToList();
                    firstPhase.PhaseCompetitors = getPhaseCompetitorsDTO(competitorService.GetCompetitorPhaseInfos(firstPhase.CompetitionPhaseId), matches, firstPhase.Settings as GroupPhaseSettings);

                }

                return phases;
            }
        }

        private PhaseCompetitorsDTO getPhaseCompetitorsDTO(List<PhaseCompetitorInfos> phaseCompetitorInfos, List<Match> matches, GroupPhaseSettings groupPhaseSettings)
        {
            PhaseCompetitorsDTO phaseCompetitorsDTO = new PhaseCompetitorsDTO();
            phaseCompetitorsDTO.Columns = GetPlayerViewModelColumns();

            var matchesVM = GenerateMatchesViewModel(matches, groupPhaseSettings);
            var playersVM = GeneratePlayersViewModel(phaseCompetitorInfos);

            phaseCompetitorsDTO.Competitors = playersVM.ToList<object>();
            phaseCompetitorsDTO.Matches = matchesVM.ToList<object>();

            return phaseCompetitorsDTO;
        }

        public List<TableTennisTournamentMatchesVM> GenerateMatchesViewModel(List<Match> matches, GroupPhaseSettings groupPhaseSettings)
        {
            List<TableTennisTournamentMatchesVM> matchesVM = new List<TableTennisTournamentMatchesVM>();
            foreach(var groupId in groupPhaseSettings.MatchIds.Keys)
            {
                foreach(var matchId in groupPhaseSettings.MatchIds[groupId])
                {
                    var match = matches.First(x => x.Id == matchId);
                    var matchInfo = MatchInfoFactory.Instance.GetMatchInfoType<TableTennisMatchInfo>(MatchInfoType);
                    matchInfo.PopulateObject(match.MatchInfo);
                    var matchVM = new TableTennisTournamentMatchesVM()
                    {
                        MatchId = match.Id,
                        CompetitorId1 = match.IdCompetitor1,
                        CompetitorId2 = match.IdCompetitor2,
                        Leg = match.Leg,
                        Sets1 = matchInfo.Sets1,
                        Sets2 = matchInfo.Sets2,
                        Result = matchInfo.Result,
                        GroupIndex = groupId
                    };

                    if (matchVM.Sets1 == null)
                    {
                        matchVM.Sets1 = new List<string>() { null, null, null, null, null, };
                    }

                    if (matchVM.Sets2 == null)
                    {
                        matchVM.Sets2 = new List<string>() { null, null, null, null, null, };
                    }

                    matchesVM.Add(matchVM);
                }
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

        public async Task InsertUpdateMatch(object matchInfo, int phaseId)
        {
            var matchDTO = convertMatchInfo(matchInfo);
            using (var matchService = new MatchService())
            {
                var matchSettings = extractMatchInfo(matchDTO);
                matchService.UpdateMatch(matchDTO.MatchId, matchSettings);

                await matchService.SaveChangesAsync();
            }
        }

        private TableTennisTournamentMatchesVM convertMatchInfo(object matchInfo)
        {
            var jObject = matchInfo as JObject;
            return jObject.ToObject<TableTennisTournamentMatchesVM>();
        }

        private MatchInfoBase extractMatchInfo(TableTennisTournamentMatchesVM matchDTO)
        {
            var settings = MatchInfoFactory.Instance.GetMatchInfoType<TableTennisMatchInfo>(MatchInfoType);
            settings.Sets1 = matchDTO.Sets1;
            settings.Sets2 = matchDTO.Sets2;
            settings.Result = matchDTO.Result;

            return settings;
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
        public List<string> Sets1 { get; set; }
        public List<string> Sets2 { get; set; }
        public string Result { get; set; }
        public int Leg { get; set; }
        public int GroupIndex { get; set; }
    }
}
