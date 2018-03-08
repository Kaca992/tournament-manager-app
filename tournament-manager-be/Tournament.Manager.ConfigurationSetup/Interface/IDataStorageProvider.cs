using System;
using System.Collections.Generic;
using System.Text;

namespace Tournament.Manager.ConfigurationSetup.Interface
{
    public interface IDataStorageProvider
    {
        bool IsDataProviderInstalled();
        void InstallDataProvider();
    }
}
