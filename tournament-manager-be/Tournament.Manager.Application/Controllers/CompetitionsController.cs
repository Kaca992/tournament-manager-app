using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Tournament.Manager.Business.CompetitionInfos;
using Tournament.Manager.Business.DTO;
using Tournament.Manager.Business.DTO.CompetitionCreation;
using Tournament.Manager.Business.Services;
using Tournament.Manager.Business.TableGeneration;

namespace Tournament.Manager.Application.Controllers
{
    [RoutePrefix("api/competition")]
    public class CompetitionsController : ApiController
    {
        [Route("create-base")]
        [HttpPost]
        public async Task<IHttpActionResult> CreateNewCompetition([FromBody] CompetitionCreationInfoDTO competitionSettings)
        {
            try
            {
                using (var competitionService = new CompetitionService())
                using (var competitorService = new CompetitorService(competitionService.DbContext))
                {
                    var competition = competitionService.CreateNewCompetition(competitionSettings.Options);
                    competitorService.InsertNewCompetitors(competition, competitionSettings.Competitors);

                    await competitionService.DbContext.SaveChangesAsync();
                    return Ok(competition.Id);
                }
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        [Route("create")]
        [HttpPost]
        public async Task<IHttpActionResult> CreateNewCompetitionWizard([FromBody] CompetitionCreationInfoDTO competitionSettings)
        {
            try
            {
                using (var competitionService = new CompetitionService())
                {
                    int competitionId = await competitionService.CreateNewCompetitionWizard(competitionSettings);
                    return Ok(competitionId);
                }               
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        [Route("{competitionId}/competitors")]
        [HttpGet]
        public async Task<IHttpActionResult> GetCompetitors(int competitionId)
        {
            using (var competitorService = new CompetitorService())
            {
                var competitorColumns = ColumnDefinitionFactory.ExtractColumnDefinitions(typeof(CompetitionInfo));
                var competitors = competitorService.GetCompetitors(competitionId);
                return Ok(new CompetitiorInfoDTO() {
                    Columns = competitorColumns,
                    Competitors = competitors
                });
            }
        }

        [Route("{competitionId}/competitors/update")]
        [HttpPost]
        public async Task<IHttpActionResult> UpdateCompetitors(int competitionId, [FromBody]List<CompetitorCreationInfoDTO> competitors)
        {
            using (var competitionPhaseService = new CompetitionPhaseService())
            using (var competitorService = new CompetitorService(competitionPhaseService.DbContext))
            {
                // TODO: HACK
                competitionPhaseService.DeleteCompetitionPhase(competitionId);
                competitorService.UpdateCompetitors(competitionId, competitors);
                await competitorService.DbContext.SaveChangesAsync();
                return Ok();
            }
        }

        [Route("{competitionId}/phases")]
        [HttpGet]
        public async Task<IHttpActionResult> GetCompetitionPhases(int competitionId)
        {
            using (var competitionPhaseService = new CompetitionPhaseService())
            {
               return Ok(competitionPhaseService.GetCompetitionPhaseInfos(competitionId));
            }
        }

        [Route("{competitionId}/phases/new")]
        [HttpPost]
        public async Task<IHttpActionResult> InsertCompetitionPhase(int competitionId, [FromBody]CompetitionCreationInfoDTO competitionSettings)
        {
            try
            {
                using (var competitionPhaseService = new CompetitionPhaseService())
                {
                    // TODO: HACK
                    competitionPhaseService.DeleteCompetitionPhase(competitionId);
                    var competitionPhaseId = await competitionPhaseService.CreateNewCompetitionPhase(competitionId, 1, competitionSettings);
                    return Ok(competitionPhaseId);
                }
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        [Route("{competitionId}/phases/{competitionPhaseId}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetCompetitionPhaseInfo(int competitionId, int competitionPhaseId)
        {
            using (var competitorService = new CompetitorService())
            {
                competitorService.GetCompetitorPhaseInfos(competitionPhaseId);
                return Ok();
            }
        }
    }
}
