
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.DataCommon.Configuration;

namespace Tournament.Manager.SQLDataProvider.Configuration
{
    public class SQLDataProviderConfiguration : IDataStorageConfiguration
    {
        public void InstallDataProvider()
        {
            if (!Directory.Exists(DbConfiguration.Instance.DB_DIRECTORY))
            {
                Directory.CreateDirectory(DbConfiguration.Instance.DB_DIRECTORY);
            }

            if (File.Exists(DbConfiguration.Instance.DbFileName))
            {
                if (File.Exists(DbConfiguration.Instance.LogFileName)) File.Delete(DbConfiguration.Instance.LogFileName);
                File.Delete(DbConfiguration.Instance.DbFileName);
                createDatabase(DbConfiguration.Instance.DatabaseName, DbConfiguration.Instance.DbFileName);
            }
            else if (!File.Exists(DbConfiguration.Instance.DbFileName))
            {
                createDatabase(DbConfiguration.Instance.DatabaseName, DbConfiguration.Instance.DbFileName);
            }

            initializeDatabase();
        }

        private void initializeDatabase()
        {
            try
            {
                FileInfo file = new FileInfo(DbConfiguration.Instance.InitializeScript);
                string script = file.OpenText().ReadToEnd();
                string[] splitter = new string[] { "\r\nGO\r\n" };
                string[] commandTexts = script.Split(splitter,StringSplitOptions.RemoveEmptyEntries);

                using (var connection = new SqlConnection(DbConfiguration.Instance.SqlConnectionString))
                {
                    connection.Open();
                    SqlCommand cmd = connection.CreateCommand();

                    foreach(var command in commandTexts)
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
                string connectionString = $"Data Source={DbConfiguration.Instance.DataSource};Initial Catalog=master;Integrated Security=True";
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
                using (var connection = new SqlConnection($"server={DbConfiguration.Instance.DataSource};Trusted_Connection=yes"))
                {
                    using (var command = new SqlCommand($"SELECT db_id('{DbConfiguration.Instance.DatabaseName}')", connection))
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

        public void RegisterRepositories()
        {
            throw new NotImplementedException();
        }
    }
}
