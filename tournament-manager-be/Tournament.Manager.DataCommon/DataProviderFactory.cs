using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.DataCommon.Configuration;

namespace Tournament.Manager.DataCommon
{
    public class DataProviderFactory
    {
        private static DataProviderFactory _instance;
        public static DataProviderFactory Instance => _instance ?? new DataProviderFactory();

        public IDataStorageConfiguration DataStorageConfiguration { get; private set; }

        public DataProviderFactory()
        {
            
        }

        public void RegisterDataStorageConfiguration(IDataStorageConfiguration dataStorageConfiguration)
        {
            DataStorageConfiguration = dataStorageConfiguration;
        }
    }
}
