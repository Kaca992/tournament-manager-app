using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Tournament.Manager.Business.CompetitionConfiguration.CompetitionInfos;
using Tournament.Manager.Business.CompetitionImplementations.TableTennis;
using Tournament.Manager.Business.DTO;
using Tournament.Manager.Business.DTO.CompetitionCreation;
using Tournament.Manager.Business.Services;
using Tournament.Manager.GridUtils;

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
    }
}
