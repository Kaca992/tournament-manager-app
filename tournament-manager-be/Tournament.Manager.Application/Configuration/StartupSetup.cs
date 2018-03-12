using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Common;
using Tournament.Manager.DataCommon;
using Tournament.Manager.DataCommon.Configuration;
using Tournament.Manager.SQLDataProvider.Configuration;

namespace Tournament.Manager.Application.Configuration
{
    public class StartupSetup
    {
        private IDataStorageConfiguration dataStorageConfiguration;
        public StartupSetup(IDataStorageConfiguration dataStorageConfiguration)
        {
            this.dataStorageConfiguration = dataStorageConfiguration;
        }

        public bool EnsureStorage()
        {
            try
            {
                if (!dataStorageConfiguration.IsDataProviderInstalled())
                {
                    dataStorageConfiguration.InstallDataProvider();
                }

                return true;
            }
            catch(Exception e)
            {
                CustomEventLog.WriteEntry(e);
                return false;
            }
        }
    }
}
