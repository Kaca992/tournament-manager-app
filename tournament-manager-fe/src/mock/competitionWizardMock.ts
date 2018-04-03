import { ICompetitorCreationInfo } from "../common/dataStructures/competitionCreation";

const dummyTeams = ['STK STUBAKI', 'STK ZABOK', '', 'ZAGREB'];

export function getTeam(playerId: number) {
    return dummyTeams[playerId % dummyTeams.length];
}

export function generateTestPlayerData(numberOfPlayers: number): ICompetitorCreationInfo[] {
    const infos: ICompetitorCreationInfo[] = [];
    for (let i = 0; i < numberOfPlayers; i++) {
        const player: ICompetitorCreationInfo = {
            id: i,
            name: `Test Player ${i}`,
            team: getTeam(i)
        };

        infos.push(player);
    }

    return infos;
}
