import { CompetitionPhaseTypeEnum, ScheduleTypeEnum, MatchInfoTypeEnum, CompetititorInfoTypeEnum } from "../enums";
import { CompetitorAllocatorEnum } from "../../utils/competitionGenerator/competitorAllocator/competitorAllocator";

export interface ICompetitionCreationInfo extends ICompetitionPhaseCreationInfo {
    options: ICompetitionConfigOptions;
    competitors: ICompetitorCreationInfo[];
}

export interface ICompetitionPhaseCreationInfo {
    advancedOptions?: ICompetitionAdvancedOptions;
    competitorsAllocation?: any;
}

export interface ICompetitionConfigOptions {
    createNewCategory?: boolean;
    competitionName?: string;
    categoryName?: string;
    categoryId?: number;
}

export interface ICompetitionAdvancedOptions {
    competitionPhaseType: CompetitionPhaseTypeEnum;
    competitionAllocatorType: CompetitorAllocatorEnum;
    scheduleType: ScheduleTypeEnum;
    competititorInfoType: CompetititorInfoTypeEnum;
    matchInfoType: MatchInfoTypeEnum;
}

export interface ICompetitorCreationInfo {
    id: number;
    name?: string;
    team?: string;
    ranking?: number;
    errorMessage?: string;
}