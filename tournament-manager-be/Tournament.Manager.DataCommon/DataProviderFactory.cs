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
        public static DataProviderFactory Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new DataProviderFactory();
                }

                return _instance;
            }
        }

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
