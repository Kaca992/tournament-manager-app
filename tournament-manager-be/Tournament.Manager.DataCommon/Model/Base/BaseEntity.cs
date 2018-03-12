using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.Manager.DataCommon
{
    public abstract class BaseEntity : IEntity
    {
        public int Id { get; set; }
    }
}
