using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.DataCommon;
using Tournament.Manager.DataCommon.Repositories;

namespace Tournament.Manager.SQLDataProvider.Repositories
{
    public abstract class GenericRepository<T, U> : IGenericRepository<T> where T : BaseEntity where U: class
    {
        protected DbContext _entities;
        protected readonly IDbSet<U> _dbset;

        public GenericRepository(DbContext context)
        {
            _entities = context;
            _dbset = context.Set<U>();
        }

        public virtual IEnumerable<T> GetAll()
        {

            return _dbset.Select(x => MapDbModelToModel(x)).AsEnumerable<T>();
        }

        public virtual T Add(T entity)
        {
            return MapDbModelToModel(_dbset.Add(MapModelToDbModel(entity)));
        }

        public virtual void Save()
        {
            _entities.SaveChanges();
        }

        protected abstract T MapDbModelToModel(U dbModel);
        protected abstract U MapModelToDbModel(T model);
    }
}
