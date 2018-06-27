import { CompetitionPhaseTypeEnum, MatchInfoTypeEnum, CompetititorInfoTypeEnum } from "enums";
import { IMatchInfo } from "../matchInfos";
import { ICustomTableHeader } from "src/components/customTable/customTable.utils";

export interface ICompetitionPhase {
    competitionPhaseId: number;
    /** How competitors are grouped. Also list of matches by leg */
    settings: ICompetitionGroupPhaseSettings;
    /** List of phase competitors and their info */
    phaseTableColumns: ICustomTableHeader[];
}

export interface ICompetitionPhaseBaseCompetitor {
    competitorId: number;
    displayName: string;
}

// TODO: simplify!!!
export interface ICompetitionPhaseSettings {
    competitionPhaseType: CompetitionPhaseTypeEnum;
    matchInfoType: MatchInfoTypeEnum;
    competitorPhaseInfoType: CompetititorInfoTypeEnum;
}

export interface ICompetitionGroupPhaseSettings extends ICompetitionPhaseSettings {
    /** Phase match ids */
    matchIds: Array<Array<number>>;
    competitorIds: Array<Array<number>>;
}
