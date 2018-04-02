import { ICompetitiorInfo } from "../../../common/dataStructures";

export enum CompetitorAllocatorEnum {
    SnakeTableAllocator = 'snake-table'
}

export interface ICompetitorAllocator<TAllocationType> {
    type: CompetitorAllocatorEnum;
    generateAllocation(competitorInfos: ICompetitiorInfo[]): TAllocationType;
}
