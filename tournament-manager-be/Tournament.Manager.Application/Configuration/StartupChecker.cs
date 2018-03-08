using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.DataCommon;
using Tournament.Manager.DataCommon.Configuration;
using Tournament.Manager.SQLDataProvider.Configuration;

namespace Tournament.Manager.Application.Configuration
{
    public class StartupChecker
    {
        public StartupChecker()
        {
            DataProviderFactory.Instance.RegisterDataStorageConfiguration(new SQLDataProviderConfiguration());
        }

        public void EnsureStorage()
        {
            if (!DataProviderFactory.Instance.DataStorageConfiguration.IsDataProviderInstalled())
            {
                DataProviderFactory.Instance.DataStorageConfiguration.InstallDataProvider();
            }
        }
    }
}
