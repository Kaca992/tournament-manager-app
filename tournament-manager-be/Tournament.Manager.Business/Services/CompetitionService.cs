using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.DTO;
using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.Services
{
    public class CompetitionService
    {
        public CompetitionService()
        {

        }

        public List<CompetitionDTO> GetAllCompetitions(int categoryId)
        {
            using (var context = DbContextFactory.Context)
            {
                return context.Competitions.Where(x => x.IdCategory == categoryId).Select(x => new CompetitionDTO()
                {
                    Id = x.Id,
                    Name = x.DisplayName
                }).ToList();
            }
        }
    }
}
