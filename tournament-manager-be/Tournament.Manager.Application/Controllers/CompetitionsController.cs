using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Tournament.Manager.Business.CompetitionInfos;
using Tournament.Manager.Business.DTO.CompetitionCreation;
using Tournament.Manager.Business.Services;
using Tournament.Manager.Business.TableGeneration;

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
                    int competitionId = await competitionService.CreateNewCompetition(competitionSettings);
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
                return Ok(competitorService.GetCompetitors(competitionId));
            }
        }
    }
}
