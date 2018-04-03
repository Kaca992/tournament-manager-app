using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Tournament.Manager.Business.Services;
using Tournament.Manager.DataCommon;

namespace Tournament.Manager.Application.Controllers
{
    [RoutePrefix("api/competition-structure")]
    public class CompetitionStructureController : ApiController
    {
        [Route("")]
        [HttpGet]
        public async Task<IHttpActionResult> GetCompetitionStructure()
        {
            using (var categoryService = new CategoryService())
            {
                return Ok(categoryService.GetCompetitionStructure());
            }
        }
    }
}
