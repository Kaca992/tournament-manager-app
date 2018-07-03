using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Tournament.Manager.Business.CompetitionConfiguration.CompetitionInfos;
using Tournament.Manager.Business.DTO;
using Tournament.Manager.Business.DTO.CompetitionCreation;
using Tournament.Manager.Business.Services;
using Tournament.Manager.GridUtils;

namespace Tournament.Manager.Application.Controllers
{
    [RoutePrefix("api/competitors")]
    public class CompetitorsController: ApiController
    {
        [Route("{competitionId}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetCompetitors(int competitionId)
        {
            using (var competitorService = new CompetitorService())
            {
                var competitorColumns = ColumnDefinitionFactory.ExtractColumnDefinitions(typeof(CompetitionInfo));
                var competitors = await competitorService.GetCompetitors(competitionId);
                return Ok(new CompetitiorInfoDTO()
                {
                    CompetitorColumns = competitorColumns,
                    Competitors = competitors
                });
            }
        }

        [Route("{competitionId}/update")]
        [HttpPost]
        public async Task<IHttpActionResult> UpdateCompetitors(int competitionId, [FromBody]List<CompetitorCreationInfoDTO> competitors)
        {
            using (var competitionPhaseService = new CompetitionPhaseService())
            using (var competitorService = new CompetitorService(competitionPhaseService.DbContext))
            {
                // TODO: HACK, delete all competition phases only if necessary (player added or removed)
                competitionPhaseService.DeleteAllCompetitionPhases(competitionId);
                competitorService.UpdateCompetitors(competitionId, competitors);
                await competitorService.DbContext.SaveChangesAsync();
                return Ok();
            }
        }
    }
}
