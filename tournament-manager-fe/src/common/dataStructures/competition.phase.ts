import { CompetitionPhaseTypeEnum, MatchInfoTypeEnum, CompetititorInfoTypeEnum } from "enums";
import { IMatchInfo } from "../matchInfos";
import { ICustomTableHeader } from "src/components/customTable/customTable.utils";

export interface ICompetitionPhase {
    competitionPhaseId: number;
    /** How competitors are grouped. Also list of matches by leg */
    settings: ICompetitionGroupPhaseSettings;
    phaseCompetitors: IGroupPhaseCompetitors;
}

// TODO: separate all this and put it directly into ICompetitionPhase
export interface IGroupPhaseCompetitors {
    competitors: IGroupPhaseCompetitor[];
    columns: ICustomTableHeader[];
    matches: IMatchInfo[];
}

// rename to base competitor or something like that. This only needs id (maybe display name) for grouping purposes
export interface IGroupPhaseCompetitor {
    competitorId: number;
    displayName: string;
}

export interface ICompetitionPhaseSettings {
    competitionPhaseType: CompetitionPhaseTypeEnum;
    matchInfoType: MatchInfoTypeEnum;
    competitorPhaseInfoType: CompetititorInfoTypeEnum;
}

export interface ICompetitionGroupPhaseSettings extends ICompetitionPhaseSettings {
    matchIds: Array<Array<number>>;
    competitorIds: Array<Array<number>>;
}
