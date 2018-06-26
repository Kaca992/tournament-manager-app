using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionConfiguration.MatchInfos;
using Tournament.Manager.Business.MatchInfos;

namespace Tournament.Manager.Business.Sorting
{
    public interface ISortableData : IComparable
    {
        int ID { get; set; }
        int Wins { get; set; }
        void Aggregate(object data);
        void Update<TMatchInfo>(DbMatchInfo<TMatchInfo> match) where TMatchInfo : MatchInfoBase;
    }
}
