import { MatchInfoTypeEnum } from "./enums";

export interface IMatchInfo {
    matchInfoType: MatchInfoTypeEnum;
    matchId: number;
    competitorId1: number;
    competitorId2: number;
    leg: number;
    groupIndex: number;
}

export interface ITableTennisMatchInfo extends IMatchInfo {
    matchInfoType: MatchInfoTypeEnum.TableTennisTournament;
    sets1: Array<number>;
    sets2: Array<number>;
    result: string;
}
