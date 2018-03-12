using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Tournament.Manager.Application.Controllers
{
    [RoutePrefix("api/categories")]
    public class CategoriesController : ApiController
    {
        [Route("")]
        [HttpGet]
        public async Task<IHttpActionResult> GetAllCategories()
        {
            return Ok();
        }
    }
}
