import { ICustomTableHeader } from "../../components/customTable/customTable.utils";
import { CompetitionPhaseTypeEnum, MatchInfoTypeEnum, CompetititorInfoTypeEnum } from "../enums";
import { IMatchInfo } from "../matchInfos";

export interface ICompetitorTableInfo {
    competitors: ICompetitorInfo[];
    columns: ICustomTableHeader[];
}

export interface ICompetitorInfo {
    id: number;
    name?: string;
    team?: string;
    ranking?: number;
}

export interface ICompetitionPhase {
    competitionPhaseId: number;
    settings: ICompetitionGroupPhaseSettings;
    phaseCompetitors: IGroupPhaseCompetitors;
}

export interface IGroupPhaseCompetitors {
    competitors: IGroupPhaseCompetitor[];
    columns: ICustomTableHeader[];
    matches: IMatchInfo[];
}

export interface IGroupPhaseCompetitor {
    competitorId: number;
    displayName: string;
}

export interface ICompetitionPhaseSettings {
    competitionPhaseType: CompetitionPhaseTypeEnum;
    matchInfoType: MatchInfoTypeEnum;
    competitorPhaseInfoType: CompetititorInfoTypeEnum;
}

export interface ICompetitionGroupPhaseSettings extends ICompetitionPhaseSettings{
    matchIds: Array<Array<number>>;
    competitorIds: Array<Array<number>>;
}