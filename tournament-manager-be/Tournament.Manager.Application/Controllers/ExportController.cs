using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Tournament.Manager.Application.Controllers
{
    [RoutePrefix("api/export")]
    public class ExportController : ApiController
    {
        [Route("{competitionId}/{phaseId}/{fileName}")]
        [HttpGet]
        public async Task<IHttpActionResult> Export(int competitionId, int phaseId, string fileName)
        {
            try
            {
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest();
            }
        }
    }
}
