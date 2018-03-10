using System;
using System.Collections.Generic;
using System.Data.Entity.Core.EntityClient;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.Manager.SQLDataProvider.Configuration
{
    public class DbConfiguration
    {
        private static DbConfiguration _instance;
        public static DbConfiguration Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new DbConfiguration();
                }

                return _instance;
            }
        }

        public readonly string DB_DIRECTORY;
        public readonly string DbFileName;
        public readonly string LogFileName;

        public readonly string DatabaseName;
        public readonly string DataSource;
        public readonly string InitializeScript;

        private DbConfiguration()
        {
            DatabaseName = "TM_Database";
            DataSource = "localhost\\SQLEXPRESS";
            InitializeScript = "Scripts\\Initialize.sql";
            DB_DIRECTORY = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "TournamentManager");
            DbFileName = Path.Combine(DB_DIRECTORY, $"{DatabaseName}.mdf");
            LogFileName = Path.Combine(DB_DIRECTORY, String.Format("{0}_log.ldf", DatabaseName));
        }

        public string SqlConnectionString
        {
            get
            {
                SqlConnectionStringBuilder sqlString = new SqlConnectionStringBuilder()
                {
                    DataSource = DataSource,
                    InitialCatalog = DatabaseName,
                    IntegratedSecurity = true
                };

                return sqlString.ToString();
            }
        }

        public string EFConnectionString
        {
            get
            {
                EntityConnectionStringBuilder entityString = new EntityConnectionStringBuilder()
                {
                    Provider = "System.Data.SqlClient",
                    Metadata = "metadata=res://*/Model1.csdl|res://*/Model1.ssdl|res://*/Model1.msl",
                    ProviderConnectionString = SqlConnectionString,
                    Name = "Entities"
                };

                return entityString.ConnectionString;
            }
        }
    }
}
