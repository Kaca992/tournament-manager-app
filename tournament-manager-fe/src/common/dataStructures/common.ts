import { CompetitionPhaseTypeEnum } from "./../enums";
import { CompetitorAllocatorEnum } from "../../utils/competitionGenerator/competitorAllocator/competitorAllocator";

export interface ICompetition {
    id: number;
    name: string;
}

export interface ICategory {
    id: number;
    name: string;
    competitions: ICompetition[];
}

export interface ITableCompetitorInfos {
    [tableId: number]: number[];
}
