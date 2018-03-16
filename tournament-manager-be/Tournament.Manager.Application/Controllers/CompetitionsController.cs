using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Tournament.Manager.Business.Services;

namespace Tournament.Manager.Application.Controllers
{
    [RoutePrefix("api/competition")]
    public class CompetitionsController : ApiController
    {
        [Route("{categoryId}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllCompetitions(int categoryId)
        {
            var competitionService = new CompetitionService();
            return Ok(competitionService.GetAllCompetitions(categoryId));
        }
    }
}
