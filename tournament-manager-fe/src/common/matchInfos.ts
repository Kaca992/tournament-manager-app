import { CompetitionTypeEnum } from "enums";

export interface IMatchInfo {
    competitionType: CompetitionTypeEnum;
    matchId: number;
    competitorId1: number;
    competitorId2: number;
    leg: number;
    groupIndex: number;
}

export interface ITableTennisMatchInfo extends IMatchInfo {
    competitionType: CompetitionTypeEnum.TableTennisTournament;
    sets1: Array<string | null>;
    sets2: Array<string | null>;
    result: string;
}
