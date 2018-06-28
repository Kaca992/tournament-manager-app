using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Tournament.Manager.Business.Factories;
using Tournament.Manager.Business.Services;

namespace Tournament.Manager.Application.Controllers
{
    [RoutePrefix("api/competition-phases")]
    public class CompetitionPhasesController: ApiController
    {
        [Route("list/{competitionId}")]
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

        [Route("{phaseId}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetCompetitionPhaseInformation(int phaseId)
        {
            try
            {
                using (var competitionPhaseService = new CompetitionPhaseService())
                {
                    var competitionType = competitionPhaseService.GetCompetitionPhaseType(phaseId);
                    var competition = CompetitionFactory.Instance.GetCompetition(competitionType);

                    var matchesVM = competition.GenerateMatchesViewModel(phaseId);
                    var competitorsVM = competition.GenerateCompetitorInfosViewModel(phaseId);
                    await Task.WhenAll(new List<Task> {matchesVM, competitorsVM});

                    return Ok(new
                    {
                        PhaseId = phaseId,
                        Matches = matchesVM.Result,
                        Competitors = competitorsVM.Result
                    });
                }
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }
    }
}
