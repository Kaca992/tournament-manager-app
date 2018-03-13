using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.SQLDataProvider.Configuration;

namespace Tournament.Manager.SQLDataProvider
{
    public static class DbContextFactory
    {
        public static string EntityFrameworkConnectionString = LocalDbConfiguration.Instance.EFConnectionString;
        public static Entities Context
        {
            get
            {
                return new Entities(EntityFrameworkConnectionString);
            }
        }
    }
}
