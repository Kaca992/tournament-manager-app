using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.DataCommon.Repositories;

namespace Tournament.Manager.DataCommon.Configuration
{
    public interface IDataStorageConfiguration
    {
        bool IsDataProviderInstalled();
        void InstallDataProvider();

        object CreateNewContext();
        IUnitOfWork GetUnitOfWork(object context);
        ICategoryRepository GetCategoryRepository(object context);
    }
}
