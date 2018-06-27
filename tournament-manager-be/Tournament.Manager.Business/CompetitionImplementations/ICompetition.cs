using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionConfiguration.CompetitionPhases;
using Tournament.Manager.GridUtils;

namespace Tournament.Manager.Business.CompetitionImplementations
{
    public interface ICompetition
    {
        /// <summary>
        /// Column definitions used for generating custom table for competition phase. This can be custom for each phase
        /// </summary>
        /// <returns></returns>
        List<ColumnDefinition> GetPhaseTableColumns(int phaseId, PhaseInfoSettings phaseSettings);
    }
}
