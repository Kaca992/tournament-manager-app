
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.DataCommon;
using Tournament.Manager.DataCommon.Configuration;

namespace Tournament.Manager.SQLDataProvider.Configuration
{
    public class LocalDbDataProviderConfiguration : IDataStorageConfiguration
    {
        #region Initialization
        public void InstallDataProvider()
        {
            if (!Directory.Exists(LocalDbConfiguration.Instance.DB_DIRECTORY))
            {
                Directory.CreateDirectory(LocalDbConfiguration.Instance.DB_DIRECTORY);
            }

            if (File.Exists(LocalDbConfiguration.Instance.DbFileName))
            {
                if (File.Exists(LocalDbConfiguration.Instance.LogFileName)) File.Delete(LocalDbConfiguration.Instance.LogFileName);
                File.Delete(LocalDbConfiguration.Instance.DbFileName);
                createDatabase(LocalDbConfiguration.Instance.DatabaseName, LocalDbConfiguration.Instance.DbFileName);
            }
            else if (!File.Exists(LocalDbConfiguration.Instance.DbFileName))
            {
                createDatabase(LocalDbConfiguration.Instance.DatabaseName, LocalDbConfiguration.Instance.DbFileName);
            }

            initializeDatabase();
        }

        private void initializeDatabase()
        {
            try
            {
                FileInfo file = new FileInfo(LocalDbConfiguration.Instance.InitializeScript);
                string script = file.OpenText().ReadToEnd();
                string[] splitter = new string[] { "\r\nGO\r\n" };
                string[] commandTexts = script.Split(splitter,StringSplitOptions.RemoveEmptyEntries);

                using (var connection = new SqlConnection(LocalDbConfiguration.Instance.SqlConnectionString))
                {
                    connection.Open();
                    SqlCommand cmd = connection.CreateCommand();

                    foreach(var command in commandTexts)
                    {
                        cmd.CommandText = command;
                        cmd.ExecuteNonQuery();
                    }
                }

                initializeDatabaseData();
            }
            catch
            {
                throw;
            }
        }

        private void initializeDatabaseData()
        {
            try
            {
                FileInfo file = new FileInfo(LocalDbConfiguration.Instance.InitDataStcript);
                string script = file.OpenText().ReadToEnd();
                string[] splitter = new string[] { "\r\nGO\r\n" };
                string[] commandTexts = script.Split(splitter, StringSplitOptions.RemoveEmptyEntries);

                using (var connection = new SqlConnection(LocalDbConfiguration.Instance.SqlConnectionString))
                {
                    connection.Open();
                    SqlCommand cmd = connection.CreateCommand();

                    foreach (var command in commandTexts)
                    {
                        cmd.CommandText = command;
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch
            {
                throw;
            }
        }

        private bool createDatabase(string dbName, string dbFileName)
        {
            try
            {
                string connectionString = $"Data Source={LocalDbConfiguration.Instance.DataSource};Initial Catalog=master;Integrated Security=True";
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand cmd = connection.CreateCommand();


                    detachDatabase(dbName, connectionString);

                    cmd.CommandText = String.Format("CREATE DATABASE {0} ON (NAME = N'{0}', FILENAME = '{1}')", dbName, dbFileName);
                    cmd.ExecuteNonQuery();
                }

                if (File.Exists(dbFileName)) return true;
                else return false;
            }
            catch
            {
                throw;
            }
        }

        public bool detachDatabase(string dbName, string connectionString)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    SqlCommand cmd = connection.CreateCommand();
                    cmd.CommandText = String.Format("exec sp_detach_db '{0}'", dbName);
                    cmd.ExecuteNonQuery();

                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        public bool IsDataProviderInstalled()
        {
            try
            {
                using (var connection = new SqlConnection($"server={LocalDbConfiguration.Instance.DataSource};Trusted_Connection=yes"))
                {
                    using (var command = new SqlCommand($"SELECT db_id('{LocalDbConfiguration.Instance.DatabaseName}')", connection))
                    {
                        connection.Open();
                        return (command.ExecuteScalar() != DBNull.Value);
                    }
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        #endregion
    }
}
