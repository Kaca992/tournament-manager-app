using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionConfiguration;
using Tournament.Manager.Business.CompetitionConfiguration.Attributes;
using Tournament.Manager.Business.CompetitionConfiguration.CompetitionInfos;
using Tournament.Manager.Business.CompetitionConfiguration.CompetitionPhases;
using Tournament.Manager.Business.CompetitionConfiguration.CompetitionPhases.Group;
using Tournament.Manager.Business.CompetitionConfiguration.CompetitorInfos;
using Tournament.Manager.Business.CompetitionConfiguration.MatchInfos;
using Tournament.Manager.Business.CompetitionImplementations;
using Tournament.Manager.Business.CompetitionImplementations.TableTennis;
using Tournament.Manager.Business.DTO;
using Tournament.Manager.Business.Factories;
using Tournament.Manager.Business.Services;
using Tournament.Manager.Common.Enums;
using Tournament.Manager.GridUtils;
using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.CompetitionImplementationsREAL
{
    [Competition(CompetitionTypeEnum.TableTennisTournament)]
    public class TableTennisTournament: ICompetition
    {
        public TableTennisTournament()
        {

        }

        public TableTennisMatchInfo GetNewMatchInfo() => new TableTennisMatchInfo();
        public TableTennisCompetitorInfo GetNewCompetitorInfo() => new TableTennisCompetitorInfo();
        public TableTennisTournamentSorter GetNewSorter() => new TableTennisTournamentSorter();

        #region PhaseInfo
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
                    // firstPhase.PhaseCompetitors = getPhaseCompetitorsDTO(competitorService.GetCompetitorPhaseInfos(firstPhase.CompetitionPhaseId), matches, firstPhase.Settings as GroupPhaseSettings);

                }

                return phases;
            }
        }

        private PhaseCompetitorsDTO getPhaseCompetitorsDTO(List<PhaseCompetitorInfos> phaseCompetitorInfos, List<Match> matches, GroupPhaseSettings groupPhaseSettings)
        {
            PhaseCompetitorsDTO phaseCompetitorsDTO = new PhaseCompetitorsDTO();
            phaseCompetitorsDTO.Columns = GetPhaseTableColumns(-1, groupPhaseSettings);

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
                    var matchInfo = GetNewMatchInfo();
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
                var phaseInfo = GetNewCompetitorInfo();
                phaseInfo.PopulateObject(phaseCompetitorInfo.PhaseInfoJSON);

                var competitionInfo = CompetitionInfo.DeserializeObject(phaseCompetitorInfo.CompetitionInfoJSON);
                competitionInfo.Id = phaseCompetitorInfo.CompetitorId;

                players.Add(mapToViewModel(competitionInfo, phaseInfo));
            }

            return players;
        }

        // TODO update
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

        #endregion

        #region MatchInsert
        public async Task InsertUpdateMatch(object matchInfo, int phaseId, bool removeMatch)
        {
            var matchDTO = convertMatchInfo(matchInfo);
            using (var matchService = new MatchService())
            using (var competitorService = new CompetitorService(matchService.DbContext))
            using (var competitionPhaseService = new CompetitionPhaseService(matchService.DbContext))
            {
                var settings = competitionPhaseService.GetCompetitionPhaseInfoSettings(phaseId) as GroupPhaseSettings;
                // update of match
                var matchSettings = removeMatch ? null : extractMatchInfo(matchDTO);
                matchService.UpdateMatch(matchDTO.MatchId, matchSettings);

                // update of all competitors
                var competitors = matchService.DbContext.CompetitorPhaseInfoes.Where(x => x.IdCompetitionPhase == phaseId).ToList();
                var matches = matchService.GetMatches<TableTennisMatchInfo>(phaseId);

                // update only match group
                var groupIndex = matchDTO.GroupIndex;
                var groupMatches = matches.Where(x => settings.MatchIds[groupIndex].Contains(x.MatchId)).ToList();
                var groupPlayers = competitors.Where(x => settings.CompetitorIds[groupIndex].Contains(x.IdCompetitor)).ToList();

                var sorter = GetNewSorter();
                sorter.LoadSortData(groupMatches);
                var sortedData = sorter.SortCompetitors();
                updateCompetitors(groupPlayers, sortedData);

                await matchService.SaveChangesAsync();
            }
        }

        private void updateCompetitors(List<CompetitorPhaseInfo> competitors, List<SortInfo> sortedData)
        {
            int placement = 1;
            foreach(var sorted in sortedData)
            {
                var competitor = competitors.First(x => x.IdCompetitor == sorted.ID);
                var phaseInfo = GetNewCompetitorInfo();
                phaseInfo.Wins = sorted.Wins;
                phaseInfo.Sets = $"{sorted.SetsWon} : {sorted.SetsLost}";
                phaseInfo.Placement = placement;

                competitor.PhaseInfo = phaseInfo.SerializeObject();
                placement++;
            }
        }

        private TableTennisTournamentMatchesVM convertMatchInfo(object matchInfo)
        {
            var jObject = matchInfo as JObject;
            return jObject.ToObject<TableTennisTournamentMatchesVM>();
        }

        private MatchInfoBase extractMatchInfo(TableTennisTournamentMatchesVM matchDTO)
        {
            var settings = GetNewMatchInfo();
            settings.Sets1 = matchDTO.Sets1;
            settings.Sets2 = matchDTO.Sets2;
            settings.Result = matchDTO.Result;

            return settings;
        }
        #endregion

        #region IComponent
        public List<ColumnDefinition> GetPhaseTableColumns(int phaseId, PhaseInfoSettings phaseSettings)
        {
            return ColumnDefinitionFactory.ExtractColumnDefinitions(typeof(TableTennisTournamentPlayerVM));
        }
        #endregion
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
        public string Sets { get; set; }
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
