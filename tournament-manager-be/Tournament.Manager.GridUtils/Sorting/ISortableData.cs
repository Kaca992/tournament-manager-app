using System;

namespace Tournament.Manager.GridUtils.Sorting
{
    public interface ISortableData : IComparable
    {
        int ID { get; set; }
        int Wins { get; set; }
        void Aggregate(object data);
        void Update<TMatchInfo>(TMatchInfo match);
    }
}
