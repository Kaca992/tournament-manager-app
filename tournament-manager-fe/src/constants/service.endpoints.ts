export const CompetitionStructureController = {
    getCompetitionStructure: 'api/competition-structure'
};

export const CompetitionsController = {
    createNewCompetition: 'api/competition/create',
    createNewCompetitionBase: 'api/competition/create-base'
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
    getPhasesList: (competitionId) => `api/competition-phases/list/${competitionId}`,
    getPhaseInformation: (phaseId) => `api/competition-phases/${phaseId}`,
    insertUpdateMatch: (selectedPhaseId, removeMatch) => `api/competition-phases/${selectedPhaseId}/matches/${removeMatch}`,
    createNewPhase: `api/competition-phases/new`
};
