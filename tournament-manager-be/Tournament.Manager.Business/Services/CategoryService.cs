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

        public List<CategoryDTO> GetAllCategories()
        {
            using (var context = DbContextFactory.Context)
            {
                return context.Categories.Select(x => new CategoryDTO()
                {
                    Id = x.Id,
                    Name = x.DisplayName
                }).ToList();
            }
        }
    }
}
