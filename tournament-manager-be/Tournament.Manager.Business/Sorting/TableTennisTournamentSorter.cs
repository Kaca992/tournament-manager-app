using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionConfiguration.MatchInfos;
using Tournament.Manager.Business.MatchInfos;
using Tournament.Manager.Business.MatchInfos.Implementations;
using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.Sorting
{
    public class TableTennisTournamentSorter: SortManagerBase<SortInfo>
    {
        #region Load Data
        protected override void PopulateCompetitorsInfo<T>(T match)
        {
            var tableTenissMatch = match as DbMatchInfo<TableTennisMatchInfo>;
            if (tableTenissMatch == null)
            {
                throw new ArgumentException("TableTennisTournamentSorter requires match to be of type DbMatchInfo<TableTennisMatchInfo>");
            }

            populateCompetitorsInfoInternal(tableTenissMatch);
        }

        protected override void PopulateHeadToHead<T>(T match)
        {
            var tableTenissMatch = match as DbMatchInfo<TableTennisMatchInfo>;
            if (tableTenissMatch == null)
            {
                throw new ArgumentException("TableTennisTournamentSorter requires match to be of type DbMatchInfo<TableTennisMatchInfo>");
            }

            populateHeadToHeadInternal(tableTenissMatch);
        }

        private void populateCompetitorsInfoInternal(DbMatchInfo<TableTennisMatchInfo> match)
        {
            if (!CompetitionInfos.ContainsKey(match.CompetitorId1))
            {
                CompetitionInfos.Add(match.CompetitorId1, new SortInfo() { ID = match.CompetitorId1 });
            }

            if (!CompetitionInfos.ContainsKey(match.CompetitorId2))
            {
                CompetitionInfos.Add(match.CompetitorId2, new SortInfo() { ID = match.CompetitorId2 });
            }

            CompetitionInfos[match.CompetitorId1].Update(match);
            CompetitionInfos[match.CompetitorId2].Update(match);
        }

        private void populateHeadToHeadInternal(DbMatchInfo<TableTennisMatchInfo> match)
        {
            // not played matches we dont want
            if (match.MatchInfo == null)
            {
                return;
            }

            HeadToHeadKey key = new HeadToHeadKey(match.CompetitorId1, match.CompetitorId2);
            if (!HeadToHeadInfos.ContainsKey(key))
            {
                HeadToHeadInfos.Add(key, new HeadToHeadInfo<SortInfo>(match.CompetitorId1, match.CompetitorId2));
            }

            HeadToHeadInfos[key].Info1.Update(match);
            HeadToHeadInfos[key].Info2.Update(match);
        }
        #endregion
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
                if (string.IsNullOrEmpty(match.MatchInfo.Sets1[i]) || string.IsNullOrEmpty(match.MatchInfo.Sets2[i]))
                {
                    continue;
                }

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
