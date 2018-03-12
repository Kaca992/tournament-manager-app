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
        public StartupSetup()
        {
            DataProviderFactory.Instance.RegisterDataStorageConfiguration(new SQLDataProviderConfiguration());
        }

        public bool EnsureStorage()
        {
            try
            {
                if (!DataProviderFactory.Instance.DataStorageConfiguration.IsDataProviderInstalled())
                {
                    DataProviderFactory.Instance.DataStorageConfiguration.InstallDataProvider();
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
