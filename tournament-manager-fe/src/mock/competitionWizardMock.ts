import { ICompetitiorInfo } from "../common/dataStructures";

const dummyTeams = ['STK STUBAKI', 'STK ZABOK', '', 'ZAGREB'];

export function getTeam(playerId: number) {
    return dummyTeams[playerId % dummyTeams.length];
}

export function generateTestPlayerData(numberOfPlayers: number): ICompetitiorInfo[] {
    const infos: ICompetitiorInfo[] = [];
    for (let i = 0; i < numberOfPlayers; i++) {
        const player: ICompetitiorInfo = {
            id: i,
            name: `Test Player ${i}`,
            team: getTeam(i)
        };

        infos.push(player);
    }

    return infos;
}