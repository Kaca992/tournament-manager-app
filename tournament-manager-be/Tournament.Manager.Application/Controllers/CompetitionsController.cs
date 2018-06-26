using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Tournament.Manager.Business.CompetitionConfiguration.CompetitionInfos;
using Tournament.Manager.Business.CompetitionImplementationsREAL;
using Tournament.Manager.Business.DTO;
using Tournament.Manager.Business.DTO.CompetitionCreation;
using Tournament.Manager.Business.Services;
using Tournament.Manager.GridUtils;

namespace Tournament.Manager.Application.Controllers
{
    [RoutePrefix("api/competition")]
    public class CompetitionsController : ApiController
    {
        #region Competition CRUD operations

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

        /// <summary>
        /// EXPERIMENTAL: Full wizard with creation of groups included. Base variant is used because player input is usually separate from creation of groups */
        /// </summary>
        /// <param name="competitionSettings"></param>
        /// <returns></returns>
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

        #endregion

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
            var tableTennisTournament = new TableTennisTournament();
            return Ok(tableTennisTournament.GetCompetitonPhaseDTO(competitionId));
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

        [Route("{competitionId}/phases/{phaseId}/matches/{removeMatch}")]
        [HttpPost]
        public async Task<IHttpActionResult> InsertUpdateMatch (int competitionId, int phaseId, bool removeMatch, [FromBody]object matchInfo)
        {
            try
            {
                var tableTennisTournament = new TableTennisTournament();
                await tableTennisTournament.InsertUpdateMatch(matchInfo, phaseId, removeMatch);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }

        //[Route("{competitionId}/phases/{competitionPhaseId}")]
        //[HttpGet]
        //public async Task<IHttpActionResult> GetCompetitionPhaseInfo(int competitionId, int competitionPhaseId)
        //{
        //    using (var competitorService = new CompetitorService())
        //    {
        //        competitorService.GetCompetitorPhaseInfos(competitionPhaseId);
        //        return Ok();
        //    }
        //}
    }
}
