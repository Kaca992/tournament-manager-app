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
    public class CategoryService
    {
        public CategoryService()
        {

        }

        public List<CategoryDTO> GetCompetitionStructure()
        {
            List<CategoryDTO> categoriesDTO = new List<CategoryDTO>();
            using (var context = DbContextFactory.Context)
            {
                var categories = context.Categories.Include("Competitions");

                foreach(var category in categories)
                {
                    var categoryDTO = new CategoryDTO()
                    {
                        Id = category.Id,
                        Name = category.DisplayName,
                        Competitions = new List<CompetitionDTO>()
                    };

                    foreach(var competition in category.Competitions)
                    {
                        categoryDTO.Competitions.Add(new CompetitionDTO() { Id = competition.Id, Name = competition.DisplayName });
                    }

                    categoriesDTO.Add(categoryDTO);
                }
            }

            return categoriesDTO;
        }
    }
}
