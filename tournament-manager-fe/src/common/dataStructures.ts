import { CompetitionPhaseTypeEnum } from "./enums";
import { CompetitorAllocatorEnum } from "../utils/competitionGenerator/competitorAllocator/competitorAllocator";

export interface ICompetition {
    id: number;
    name: string;
}

export interface ICategory {
    id: number;
    name: string;
    competitions: ICompetition[];
}

export interface ICompetitionCreationInfo {
    options: ICompetitionConfigOptions;
    advancedOptions: ICompetitionAdvancedOptions;

    competitors: ICompetitiorInfo[];
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

export interface ICompetitiorInfo {
    id: number;
    name?: string;
    team?: string;
    ranking?: number;
    errorMessage?: string;
}

export interface ITableCompetitorInfos {
    [tableId: number]: number[];
}
