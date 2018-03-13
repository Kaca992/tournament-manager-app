using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.Manager.SQLDataProvider
{
    public partial class Entities: DbContext
    {
        public Entities(string connectionString) : base(connectionString)
        {

        }
    }
}
