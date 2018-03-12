using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.DataCommon;
using Tournament.Manager.DataCommon.Model;
using Tournament.Manager.DataCommon.Repositories;

namespace Tournament.Manager.Business.Services
{
    public class CategoryService: EntityService<CategoryEntity>
    {
        protected ICategoryRepository categoryRepository;
        public CategoryService(IUnitOfWork unitOfWork, ICategoryRepository categoryRepository): base(unitOfWork, categoryRepository)
        {
            this.categoryRepository = categoryRepository;
        }

        public IEnumerable<CategoryEntity> GetAllCategories()
        {
            return categoryRepository.GetAll();
        }
    }
}
