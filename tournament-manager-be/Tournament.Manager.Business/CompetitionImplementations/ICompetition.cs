using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.CompetitionConfiguration.CompetitionPhases;
using Tournament.Manager.Business.CompetitionImplementationsREAL;
using Tournament.Manager.Business.Services;
using Tournament.Manager.GridUtils;

namespace Tournament.Manager.Business.CompetitionImplementations
{
    public interface ICompetition
    {
        /// <summary>
        /// Column definitions used for generating custom table for competition phase. This can be custom for each phase
        /// </summary>
        /// <param name="phaseId"></param>
        /// <param name="phaseSettings"></param>
        /// <returns></returns>
        List<ColumnDefinition> GetPhaseTableColumns(int phaseId, PhaseInfoSettings phaseSettings);

        /// <summary>
        /// Returns View model object for match list of a competition phase
        /// </summary>
        /// <param name="competitionPhaseId"></param>
        /// <param name="competitionPhaseService"></param>
        /// <returns></returns>
        Task<List<object>> GenerateMatchesViewModel(int competitionPhaseId, CompetitionPhaseService competitionPhaseService);

        /// <summary>
        /// Returns competitor infos view model for a competition phase (ex. information that goes into a table for group phase)
        /// </summary>
        /// <param name="competitionPhaseId"></param>
        /// <param name="competitionPhaseService"></param>
        /// <returns></returns>
        Task<List<object>> GenerateCompetitorInfosViewModel(int competitionPhaseId, CompetitionPhaseService competitionPhaseService);
    }
}
