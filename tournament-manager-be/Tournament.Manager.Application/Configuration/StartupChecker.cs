using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.DataCommon.Configuration;
using Tournament.Manager.SQLDataProvider.Configuration;

namespace Tournament.Manager.Application.Configuration
{
    public class StartupChecker
    {
        public IDataStorageConfiguration DataStorageConfiguration { get; private set; }

        public StartupChecker()
        {
            registerDataStorageConfiguration();
        }

        public void EnsureStorage()
        {
            if (!DataStorageConfiguration.IsDataProviderInstalled())
            {
                DataStorageConfiguration.InstallDataProvider();
            }
        }

        private void registerDataStorageConfiguration()
        {
            DataStorageConfiguration = new SQLDataProviderConfiguration();
        }
    }
}
