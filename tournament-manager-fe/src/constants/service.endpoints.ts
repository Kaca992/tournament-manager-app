export const CompetitionStructureController = {
    getCompetitionStructure: 'api/competition-structure'
};

export const CompetitionsController = {
    createNewCompetition: 'api/competition/create',
    getCompetitors: (competitionId) => `api/competition/${competitionId}/competitors`,
    getPhases: (competitionId) => `api/competition/${competitionId}/phases`
};
