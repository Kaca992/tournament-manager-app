﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Tournament.Manager.Business.CompetitionInfos;
using Tournament.Manager.Business.DTO;
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
                var competitors = competitorService.GetCompetitors(competitionId);
                return Ok(new CompetitiorInfoDTO() {
                    Columns = competitorColumns,
                    Competitors = competitors
                });
            }
        }

        [Route("{competitionId}/phases")]
        [HttpGet]
        public async Task<IHttpActionResult> GetCompetitionPhases(int competitionId)
        {
            using (var competitionPhaseService = new CompetitionPhaseService())
            {
               return Ok(competitionPhaseService.GetCompetitionPhaseInfos(competitionId));
            }
        }

        [Route("{competitionId}/phases/{competitionPhaseId}")]
        [HttpGet]
        public async Task<IHttpActionResult> GetCompetitionPhaseInfo(int competitionId, int competitionPhaseId)
        {
            using (var competitorService = new CompetitorService())
            {
                competitorService.GetCompetitorPhaseInfos(competitionPhaseId);
                return Ok();
            }
        }
    }
}
