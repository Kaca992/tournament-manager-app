using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.DataCommon.Model;
using Tournament.Manager.DataCommon.Repositories;

namespace Tournament.Manager.SQLDataProvider.Repositories
{
    public class SQLCategoryRepository : GenericRepository<CategoryEntity, Category>, ICategoryRepository
    {
        public SQLCategoryRepository(DbContext context) : base(context)
        {
        }

        protected override CategoryEntity MapDbModelToModel(Category dbModel)
        {
            throw new NotImplementedException();
        }

        protected override Category MapModelToDbModel(CategoryEntity model)
        {
            throw new NotImplementedException();
        }
    }
}
