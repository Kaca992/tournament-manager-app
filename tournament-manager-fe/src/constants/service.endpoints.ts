export const CompetitionStructureController = {
    getCompetitionStructure: 'api/competition-structure'
};

export const CompetitionsController = {
    createNewCompetition: 'api/competition/create',
    createNewCompetitionBase: 'api/competition/create-base',
    createNewPhase: (competitionId) => `api/competition/${competitionId}/phases/new`,
    insertUpdateMatch: (competitionId, selectedPhaseId, removeMatch) => `api/competition/${competitionId}/phases/${selectedPhaseId}/matches/${removeMatch}`
};

export const ExportController = {
    export: (competitionId, phaseId) => `api/export/${competitionId}/${phaseId}`,
    exportSchedule: (competitionId, phaseId) => `api/export/schedule/${competitionId}/${phaseId}`
};

export const CompetitorsController = {
    getCompetitors: (competitionId) => `api/competitors/${competitionId}`,
    updateCompetitors: (competitionId) => `api/competitors/${competitionId}/update`
};

export const CompetitionPhasesController = {
    getPhasesList: (competitionId) => `api/competition-phases/${competitionId}`,
};
