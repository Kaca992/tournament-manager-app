using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Tournament.Manager.Business.CompetitionImplementationsREAL;
using Tournament.Manager.Business.Factories;
using Tournament.Manager.Business.Services;

namespace Tournament.Manager.Application.Controllers
{
    [RoutePrefix("api/competition-phases")]
    public class CompetitionPhasesController: ApiController
    {
        [Route("{competitionId}")]
        [HttpGet]
        public IHttpActionResult GetCompetitionPhases(int competitionId)
        {
            try
            {
                using (var competitionPhaseService = new CompetitionPhaseService())
                {
                    var phases = competitionPhaseService.GetCompetitionPhaseInfos(competitionId);
                    return Ok(phases);
                }
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [Route("information")]
        [HttpGet]
        public async Task<IHttpActionResult> GetCompetitionPhaseInformation(int phaseId)
        {
            try
            {
                using (var competitionPhaseService = new CompetitionPhaseService())
                {
                    var competitionType = competitionPhaseService.GetCompetitionPhaseType(phaseId);
                    var competition = CompetitionFactory.Instance.GetCompetition(competitionType);

                    var matchesVM = competition.GenerateMatchesViewModel(phaseId, competitionPhaseService);
                    var competitorsVM = competition.GenerateCompetitorInfosViewModel(phaseId, competitionPhaseService);
                    await Task.WhenAll(new List<Task> {matchesVM, competitorsVM});

                    return Ok(new
                    {
                        Matches = matchesVM,
                        Competitors = competitorsVM
                    });
                }
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}
