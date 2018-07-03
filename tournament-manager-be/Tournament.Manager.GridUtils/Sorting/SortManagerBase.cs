using System;
using System.Collections.Generic;
using System.Linq;

namespace Tournament.Manager.GridUtils.Sorting
{
    public abstract class SortManagerBase<TSortInfo> where TSortInfo: ISortableData, new()
    {
        private Dictionary<int, TSortInfo> _competitionInfos;
        private Dictionary<HeadToHeadKey, HeadToHeadInfo<TSortInfo>> _headToHeadInfos;

        /// <summary>
        /// Populates Competition infos and head to head infos. Needs to run before Sort, otherwise will fail
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="matches"></param>
        public void LoadSortData<T>(List<T> matches)
        {
            _competitionInfos = new Dictionary<int, TSortInfo>();
            _headToHeadInfos = new Dictionary<HeadToHeadKey, HeadToHeadInfo<TSortInfo>>();
            foreach (var match in matches)
            {
                PopulateCompetitorsInfo(match, _competitionInfos);
                PopulateHeadToHead(match, _headToHeadInfos);
            }
        }

        protected abstract void PopulateCompetitorsInfo<T>(T match, Dictionary<int, TSortInfo> competitionInfos);
        protected abstract void PopulateHeadToHead<T>(T match, Dictionary<HeadToHeadKey, HeadToHeadInfo<TSortInfo>> headToHeadInfos);

        /// <summary>
        /// Sorts competitors by IComperable TSortInfo. If they have same Wins then it will sort them by HeadToHeadInfo also. If no head to head matches found, then it will use only IComperable TSortInfo.
        /// If you wish to disable comparing by head to head just return empty dictionary from PopulateHeadToHead
        /// </summary>
        /// <returns></returns>
        public List<TSortInfo> SortCompetitors()
        {
            if (_competitionInfos == null)
            {
                throw new ArgumentException("Must call Load data before Sort!!!");
            }

            var competitors = _competitionInfos.Values.ToList();
            List<int> sortedCompetitorIds = sortCompetitionData(competitors, _headToHeadInfos);

            var sortedCompetitorsData = new List<TSortInfo>();
            foreach (var competitorId in sortedCompetitorIds)
            {
                sortedCompetitorsData.Add(_competitionInfos[competitorId]);
            }

            return sortedCompetitorsData;
        }

        #region Sort helpers
        private List<int> sortCompetitionData(List<TSortInfo> competitors, Dictionary<HeadToHeadKey, HeadToHeadInfo<TSortInfo>> headToHeadInfos)
        {
            var sortedDataIds = new List<int>();
            competitors.Sort();
            competitors.Reverse();

            int lastWins = competitors.FirstOrDefault()?.Wins ?? 0;
            var dataWithSameWins = new List<TSortInfo>();
            foreach (var data in competitors)
            {
                if (data.Wins != lastWins)
                {
                    sortedDataIds.AddRange(sortDataWithSamePoints(dataWithSameWins, headToHeadInfos));
                    dataWithSameWins.Clear();

                    lastWins = data.Wins;
                    dataWithSameWins.Add(data);
                }
                else
                {
                    dataWithSameWins.Add(data);
                }
            }

            sortedDataIds.AddRange(sortDataWithSamePoints(dataWithSameWins, headToHeadInfos));
            return sortedDataIds;
        }

        private IEnumerable<int> sortDataWithSamePoints(List<TSortInfo> dataWithSameWins, Dictionary<HeadToHeadKey, HeadToHeadInfo<TSortInfo>> headToHeadInfos)
        {
            if (dataWithSameWins.Count == 1)
            {
                return new List<int>() { dataWithSameWins.First().ID };
            }

            Dictionary<int, TSortInfo> headToHeadInfo = new Dictionary<int, TSortInfo>();
            foreach (var data in dataWithSameWins)
            {
                headToHeadInfo.Add(data.ID, new TSortInfo());
                headToHeadInfo[data.ID].ID = data.ID;
            }

            // if none than we just return as was sorted in start
            bool hasHeadToHead = false;
            for (int i = 0; i < dataWithSameWins.Count - 1; i++)
            {
                for (int j = i + 1; j < dataWithSameWins.Count; j++)
                {
                    var headToHeadKey = new HeadToHeadKey(dataWithSameWins[i].ID, dataWithSameWins[j].ID);
                    if (headToHeadInfos.ContainsKey(headToHeadKey))
                    {
                        hasHeadToHead = true;
                        var headToHead = headToHeadInfos[headToHeadKey];
                        headToHeadInfo[headToHead.Info1.ID].Aggregate(headToHead.Info1);
                        headToHeadInfo[headToHead.Info2.ID].Aggregate(headToHead.Info2);
                    }
                }
            }

            // no head to head found so we return as it was
            if (!hasHeadToHead)
            {
                return dataWithSameWins.Select(x => x.ID).ToList();
            }

            var headToHeadTeamList = headToHeadInfo.Values.ToList();
            headToHeadTeamList.Sort();
            headToHeadTeamList.Reverse();

            return headToHeadTeamList.Select(x => x.ID).ToList();
        }
        #endregion
    }
}
