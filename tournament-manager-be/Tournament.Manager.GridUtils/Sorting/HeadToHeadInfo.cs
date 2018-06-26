using System;

namespace Tournament.Manager.GridUtils.Sorting
{
    /// <summary>
    /// Used for head to head sorting
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class HeadToHeadInfo<T> where T : IComparable
    {
        public T Info1 { get; set; }
        public T Info2 { get; set; }

        public HeadToHeadInfo(int infoId1, int infoId2)
        {
            var id1 = infoId1 > infoId2 ? infoId1 : infoId2;
            var id2 = infoId1 > infoId2 ? infoId2 : infoId1;

            Info1 = (T)Activator.CreateInstance(typeof(T), id1);
            Info2 = (T)Activator.CreateInstance(typeof(T), id2);
        }
    }

    public class HeadToHeadKey
    {
        public int Id1 { get; set; }
        public int Id2 { get; set; }

        public HeadToHeadKey(int id1, int id2)
        {
            Id1 = id1 > id2 ? id1 : id2;
            Id2 = id1 > id2 ? id2 : id1;
        }

        public override bool Equals(object obj)
        {
            HeadToHeadKey h2 = obj as HeadToHeadKey;
            if (h2 == null)
                return false;
            return Id1 == h2.Id1 && Id2 == h2.Id2;
        }

        public override int GetHashCode()
        {
            unchecked
            {
                int hash = 17;
                hash = hash * 23 + Id1.GetHashCode();
                hash = hash * 23 + Id2.GetHashCode();
                return hash;
            }
        }
    }
}
