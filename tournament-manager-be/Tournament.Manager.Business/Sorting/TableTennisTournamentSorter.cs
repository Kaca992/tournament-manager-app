using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.MatchInfos;
using Tournament.Manager.Business.MatchInfos.Implementations;
using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.Sorting
{
    public class TableTennisTournamentSorter
    {
        public readonly Dictionary<int, SortInfo> PlayerCompetitionInfos = new Dictionary<int, SortInfo>();
        public readonly Dictionary<HeadToHeadKey, HeadToHeadInfo<SortInfo>> PlayerHeadToHeadInfos = new Dictionary<HeadToHeadKey, HeadToHeadInfo<SortInfo>>();

        #region Load Data
        public void LoadSortData(List<DbMatchInfo<TableTennisMatchInfo>> matches)
        {
            foreach(var match in matches)
            {
                populateCompetitorsInfo(match);
                populateHeadToHead(match);
            }
        }

        protected void populateCompetitorsInfo(DbMatchInfo<TableTennisMatchInfo> match)
        {
            if (!PlayerCompetitionInfos.ContainsKey(match.CompetitorId1))
            {
                PlayerCompetitionInfos.Add(match.CompetitorId1, new SortInfo() { ID = match.CompetitorId1 });
            }

            if (!PlayerCompetitionInfos.ContainsKey(match.CompetitorId2))
            {
                PlayerCompetitionInfos.Add(match.CompetitorId2, new SortInfo() { ID = match.CompetitorId2 });
            }

            PlayerCompetitionInfos[match.CompetitorId1].Update(match);
            PlayerCompetitionInfos[match.CompetitorId2].Update(match);
        }

        protected void populateHeadToHead(DbMatchInfo<TableTennisMatchInfo> match)
        {
            // not played matches we dont want
            if (match.MatchInfo == null)
            {
                return;
            }

            HeadToHeadKey key = new HeadToHeadKey(match.CompetitorId1, match.CompetitorId2);
            if (!PlayerHeadToHeadInfos.ContainsKey(key))
            {
                PlayerHeadToHeadInfos.Add(key, new HeadToHeadInfo<SortInfo>(match.CompetitorId1, match.CompetitorId2));
            }

            PlayerHeadToHeadInfos[key].Info1.Update(match);
            PlayerHeadToHeadInfos[key].Info2.Update(match);
        }
        #endregion

        public List<SortInfo> SortCompetitors()
        {
            var competitors = PlayerCompetitionInfos.Values.ToList();
            List<int> sortedCompetitorIds = sortCompetitionData(competitors, PlayerHeadToHeadInfos);

            var sortedCompetitorsData = new List<SortInfo>();
            foreach (var competitorId in sortedCompetitorIds)
            {
                sortedCompetitorsData.Add(PlayerCompetitionInfos[competitorId]);
            }

            return sortedCompetitorsData;
        }

        private List<int> sortCompetitionData(List<SortInfo> competitors, Dictionary<HeadToHeadKey, HeadToHeadInfo<SortInfo>> playerHeadToHeadInfos)
        {
            var sortedDataIds = new List<int>();
            competitors.Sort();
            competitors.Reverse();

            int lastWins = competitors.FirstOrDefault()?.Wins ?? 0;
            var dataWithSameWins = new List<SortInfo>();
            foreach (var data in competitors)
            {
                if (data.Wins != lastWins)
                {
                    sortedDataIds.AddRange(sortDataWithSamePoints(dataWithSameWins, playerHeadToHeadInfos));
                    dataWithSameWins.Clear();

                    lastWins = data.Wins;
                    dataWithSameWins.Add(data);
                }
                else
                {
                    dataWithSameWins.Add(data);
                }
            }

            sortedDataIds.AddRange(sortDataWithSamePoints(dataWithSameWins, playerHeadToHeadInfos));
            return sortedDataIds;
        }

        private IEnumerable<int> sortDataWithSamePoints(List<SortInfo> dataWithSameWins, Dictionary<HeadToHeadKey, HeadToHeadInfo<SortInfo>> playerHeadToHeadInfos)
        {
            if (dataWithSameWins.Count == 1)
            {
                return new List<int>() { dataWithSameWins.FirstOrDefault().ID };
            }

            Dictionary<int, SortInfo> headToHeadInfo = new Dictionary<int, SortInfo>();
            foreach (var data in dataWithSameWins)
            {
                headToHeadInfo.Add(data.ID, new SortInfo());
                headToHeadInfo[data.ID].ID = data.ID;
            }

            // if none than we just return as was sorted in start
            bool hasHeadToHead = false;
            for (int i = 0; i < dataWithSameWins.Count - 1; i++)
            {
                for (int j = i + 1; j < dataWithSameWins.Count; j++)
                {
                    var headToHeadKey = new HeadToHeadKey(dataWithSameWins[i].ID, dataWithSameWins[j].ID);
                    if (playerHeadToHeadInfos.ContainsKey(headToHeadKey))
                    {
                        hasHeadToHead = true;
                        var headToHead = playerHeadToHeadInfos[headToHeadKey];
                        headToHeadInfo[headToHead.Info1.ID].Aggregate(headToHead.Info1);
                        headToHeadInfo[headToHead.Info2.ID].Aggregate(headToHead.Info2);
                    }
                }
            }

            if (!hasHeadToHead)
            {
                return dataWithSameWins.Select(x => x.ID).ToList();
            }

            var headToHeadTeamList = headToHeadInfo.Values.ToList();
            headToHeadTeamList.Sort();
            headToHeadTeamList.Reverse();

            return headToHeadTeamList.Select(x => x.ID).ToList();
        }
    }

    public class SortInfo : ISortableData
    {
        public int ID { get; set; }
        public int Wins { get; set; }

        public int SetsWon { get; set; }
        public int SetsLost { get; set; }
        public float SetsDifference => SetsLost != 0 || SetsWon != 0 ? (float)SetsWon / (SetsLost + SetsWon) : 1;

        public int PointsWon { get; set; }
        public int PointsLost { get; set; }
        public float PointsDifference => PointsWon != 0 || PointsLost != 0 ? (float)PointsWon / (PointsLost + PointsWon) : 1;

        public SortInfo()
        {

        }

        public SortInfo(int id)
        {
            ID = id;
        }

        public void Aggregate(object data)
        {
            var info = data as SortInfo;
            if (info == null)
            {
                return;
            }

            Wins += info.Wins;
            SetsWon += info.SetsWon;
            SetsLost += info.SetsLost;
            PointsWon += info.PointsWon;
            PointsLost += info.PointsLost;
        }

        public void Update<TMatchInfo>(DbMatchInfo<TMatchInfo> match) where TMatchInfo : MatchInfoBase
        {
            update(match as DbMatchInfo<TableTennisMatchInfo>);
        }

        private void update(DbMatchInfo<TableTennisMatchInfo> match)
        {
            if (match?.MatchInfo?.Sets1?.Any() != true)
            {
                return;
            }

            var setsWon = 0;
            for (int i = 0; i < match.MatchInfo.Sets1.Count; i++)
            {
                var pointsWon = match.CompetitorId1 == ID ? Convert.ToInt32(match.MatchInfo.Sets1[i]) : Convert.ToInt32(match.MatchInfo.Sets2[i]);
                var pointsLost = match.CompetitorId1 == ID ? Convert.ToInt32(match.MatchInfo.Sets2[i]) : Convert.ToInt32(match.MatchInfo.Sets1[i]);

                if (pointsWon == 0 && pointsLost == 0)
                {
                    continue;
                }

                if (pointsWon > pointsLost)
                {
                    SetsWon++;
                    setsWon++;
                }
                else
                {
                    SetsLost++;
                }

                PointsWon += pointsWon;
                PointsLost += pointsLost;
            }

            if (setsWon == 3)
            {
                Wins++;
            }
        }

        public int CompareTo(object obj)
        {
            if (obj == null) return 1;

            SortInfo otherInfo = obj as SortInfo;
            var order = compareValues(Wins, otherInfo.Wins);
            if (order != 0)
            {
                return order;
            }

            order = compareValues(SetsDifference, otherInfo.SetsDifference);
            if (order != 0)
            {
                return order;
            }

            order = compareValues(PointsDifference, otherInfo.PointsDifference);
            if (order != 0)
            {
                return order;
            }

            return 0;
        }

        private int compareValues(float value1, float value2)
        {
            if (value1 > value2)
            {
                return 1;
            }
            else if (value1 < value2)
            {
                return -1;
            }

            return 0;
        }
    }
}
