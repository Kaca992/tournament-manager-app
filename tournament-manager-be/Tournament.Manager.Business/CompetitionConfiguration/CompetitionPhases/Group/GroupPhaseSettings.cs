using System.Collections.Generic;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.CompetitionConfiguration.CompetitionPhases.Group
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
