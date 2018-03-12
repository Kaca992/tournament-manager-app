using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.Manager.DataCommon.Repositories
{
    public interface IGenericRepository<T> where T: BaseEntity
    {
        IEnumerable<T> GetAll();
        T Add(T entity);
        void Save();
    }
}
