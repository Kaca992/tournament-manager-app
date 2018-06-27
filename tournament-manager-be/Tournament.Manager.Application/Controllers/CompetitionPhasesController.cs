using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Tournament.Manager.Business.CompetitionImplementationsREAL;
using Tournament.Manager.Business.Services;

namespace Tournament.Manager.Application.Controllers
{
    [RoutePrefix("api/competition-phases")]
    public class CompetitionPhasesController: ApiController
    {
        [Route("{competitionId}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetCompetitionPhases(int competitionId)
        {
            try
            {
                using (var competitionPhaseService = new CompetitionPhaseService())
                {
                    // TODO: add column definitions to phase info
                    var phases = competitionPhaseService.GetCompetitionPhaseInfos(competitionId);
                    return Ok(phases);
                }
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }
    }
}
