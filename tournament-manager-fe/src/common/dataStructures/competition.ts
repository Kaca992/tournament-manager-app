import { ICustomTableHeader } from "../../components/customTable/customTable.utils";
import { CompetitionPhaseTypeEnum, MatchInfoTypeEnum, CompetititorInfoTypeEnum } from "../enums";

export interface ICompetitorTableInfo {
    competitors: ICompetitorInfo[];
    columns: ICustomTableHeader[];
}

export interface ICompetitorInfo {
    id: number;
    name: string;
    team: string;
    ranking?: number;
}

export interface ICompetitionPhase {
    competitionPhaseId: number;
    settings: ICompetitionGroupPhaseSettings;
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