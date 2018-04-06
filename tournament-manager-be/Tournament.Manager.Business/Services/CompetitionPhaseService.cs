using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.Services
{
    public class CompetitionPhaseService: BaseService
    {
        public CompetitionPhaseService() : base()
        {

        }

        public CompetitionPhaseService(Entities dbContext) : base(dbContext)
        {

        }

        public CompetitionPhase InsertNewCompetitionPhase(Competition competition, int stageId)
        {
            var newPhase = new CompetitionPhase()
            {
                Competition = competition,
                StageId = stageId
            };

            DbContext.CompetitionPhases.Add(newPhase);
            return newPhase;
        }
    }
}
