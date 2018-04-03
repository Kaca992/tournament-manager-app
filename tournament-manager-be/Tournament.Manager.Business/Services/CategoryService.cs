using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Business.DTO;
using Tournament.Manager.DataCommon;
using Tournament.Manager.SQLDataProvider;

namespace Tournament.Manager.Business.Services
{
    public class CategoryService: BaseService
    {
        public CategoryService(): base()
        {

        }

        public CategoryService(Entities dbContext): base(dbContext)
        {

        }

        public List<CategoryDTO> GetCompetitionStructure()
        {
            List<CategoryDTO> categoriesDTO = new List<CategoryDTO>();
            var categories = DbContext.Categories.Include("Competitions");

            foreach (var category in categories)
            {
                var categoryDTO = new CategoryDTO()
                {
                    Id = category.Id,
                    Name = category.DisplayName,
                    Competitions = new List<CompetitionDTO>()
                };

                foreach (var competition in category.Competitions)
                {
                    categoryDTO.Competitions.Add(new CompetitionDTO() { Id = competition.Id, Name = competition.DisplayName });
                }

                categoriesDTO.Add(categoryDTO);
            }

            return categoriesDTO;
        }
    }
}
