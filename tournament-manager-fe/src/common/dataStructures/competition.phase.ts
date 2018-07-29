import { CompetitionPhaseTypeEnum, CompetitionTypeEnum } from "@enums";
import { ICustomTableHeader } from "src/components/customTable/customTable.utils";

export interface ICompetitionPhase {
    competitionPhaseId: number;
    // TODO: implement display name
    displayName?: string;
    /** How competitors are grouped. Also list of matches by leg */
    settings: ICompetitionGroupPhaseSettings;
    /** List of phase competitors and their info */
    phaseTableColumns: ICustomTableHeader[];
}

export interface ICompetitionPhaseBaseCompetitor {
    competitorId: number;
    displayName: string;
}

export interface ICompetitionPhaseSettings {
    competitionPhaseType: CompetitionPhaseTypeEnum;
    competitionType: CompetitionTypeEnum;
}

export interface ICompetitionGroupPhaseSettings extends ICompetitionPhaseSettings {
    /** Phase match ids */
    matchIds: Array<Array<number>>;
    competitorIds: Array<Array<number>>;
}
