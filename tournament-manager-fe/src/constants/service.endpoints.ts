export const CompetitionStructureController = {
    getCompetitionStructure: 'api/competition-structure'
};

export const CompetitionsController = {
    createNewCompetition: 'api/competition/create',
    createNewCompetitionBase: 'api/competition/create-base',
    getCompetitors: (competitionId) => `api/competition/${competitionId}/competitors`,
    updateCompetitors: (competitionId) => `api/competition/${competitionId}/competitors/update`,
    getPhases: (competitionId) => `api/competition/${competitionId}/phases`,
    createNewPhase: (competitionId) => `api/competition/${competitionId}/phases/new`,
    insertUpdateMatch: (competitionId, selectedPhaseId, removeMatch) => `api/competition/${competitionId}/phases/${selectedPhaseId}/matches/${removeMatch}`
};

export const ExportController = {
    export: (competitionId, phaseId) => `api/export/${competitionId}/${phaseId}`,
    exportSchedule: (competitionId, phaseId) => `api/export/schedule/${competitionId}/${phaseId}`
};
