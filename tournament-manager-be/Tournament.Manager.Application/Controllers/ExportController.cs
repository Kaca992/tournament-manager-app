using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Tournament.Manager.Business.Services;

namespace Tournament.Manager.Application.Controllers
{
    [RoutePrefix("api/export")]
    public class ExportController : ApiController
    {
        [Route("{competitionId}/{phaseId}")]
        [HttpPost]
        public async Task<IHttpActionResult> Export(int competitionId, int phaseId, [FromBody]string fileName)
        {
            try
            {
                using (var exportService = new ExportService())
                {
                    exportService.Export(competitionId, phaseId, fileName);
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
