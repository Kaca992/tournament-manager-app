export const CategoriesController = {
    allCategories: 'api/category'
};

export const CompetitionsController = {
    allCompetitions: (categoryId) => `api/competition/${categoryId}`
};
