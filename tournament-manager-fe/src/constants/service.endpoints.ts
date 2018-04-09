export const CompetitionStructureController = {
    getCompetitionStructure: 'api/competition-structure'
};

export const CompetitionsController = {
    createNewCompetition: 'api/competition/create',
    createNewCompetitionBase: 'api/competition/create-base',
    getCompetitors: (competitionId) => `api/competition/${competitionId}/competitors`,
    updateCompetitors: (competitionId) => `api/competition/${competitionId}/competitors/update`,
    getPhases: (competitionId) => `api/competition/${competitionId}/phases`
};
