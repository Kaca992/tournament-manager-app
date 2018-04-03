import { ICompetitorCreationInfo } from "../../../common/dataStructures/competitionCreation";

export enum CompetitorAllocatorEnum {
    SnakeTableAllocator = 'snake-table'
}

export interface ICompetitorAllocator<TAllocationType> {
    type: CompetitorAllocatorEnum;
    generateAllocation(competitorInfos: ICompetitorCreationInfo[]): TAllocationType;
}
