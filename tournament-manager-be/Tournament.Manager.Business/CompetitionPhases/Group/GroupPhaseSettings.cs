using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.CompetitionPhases.Group
{
    public class GroupPhaseSettings: PhaseInfoSettings<Dictionary<int, List<int>>, Dictionary<int, List<int>>>
    {
        public GroupPhaseSettings()
        {
            CompetitionPhaseType = CompetitionPhaseTypeEnum.Table;
        }

        public GroupPhaseSettings(string json): base(json)
        {

        }
    }
}
