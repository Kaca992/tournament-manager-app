using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tournament.Manager.Business.CompetitionPhases.Group
{
    public class GroupPhaseSettings: PhaseInfoSettings<Dictionary<int, List<int>>>
    {
        public GroupPhaseSettings()
        {

        }

        public GroupPhaseSettings(string json): base(json)
        {

        }
    }
}
