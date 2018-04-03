using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Tournament.Manager.Business.DTO.CompetitionCreation;
using Tournament.Manager.Business.Services;

namespace Tournament.Manager.Application.Controllers
{
    [RoutePrefix("api/competition")]
    public class CompetitionsController : ApiController
    {
        [Route("create")]
        [HttpPost]
        public async Task<IHttpActionResult> CreateNewCompetition([FromBody] CompetitionCreationInfoDTO competitionSettings)
        {
            try
            {
                using (var competitionService = new CompetitionService())
                {
                    competitionService.CreateNewCompetition(competitionSettings);
                    await competitionService.SaveChangesAsync();
                    return Ok();
                }               
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }
    }
}
