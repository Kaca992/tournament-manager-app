export const SeasonController = {
    allSeasons: 'api/seasons'
};

export const CompetitionController = {
    getTeamInfos: (seasonId) => `api/competition/${seasonId}/teams`
};
