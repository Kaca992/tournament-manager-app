import { CompetitionPhaseTypeEnum } from "../enums";
import { CompetitorAllocatorEnum } from "../../utils/competitionGenerator/competitorAllocator/competitorAllocator";

export interface ICompetitionCreationInfo {
    options: ICompetitionConfigOptions;
    advancedOptions: ICompetitionAdvancedOptions;

    competitors: ICompetitorCreationInfo[];
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
}

export interface ICompetitorCreationInfo {
    id: number;
    name?: string;
    team?: string;
    ranking?: number;
    errorMessage?: string;
}