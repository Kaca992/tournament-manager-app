import { ITableCompetitorInfos, ICompetitiorInfo } from "../../../../common/dataStructures";
import { ICompetitorAllocator, CompetitorAllocatorEnum } from "../competitorAllocator";
import { ITableAllocatorSettings, TableAllocatorBase } from "./table";

interface ISnakeTableAllocatorSettings extends ITableAllocatorSettings {

}

export class SnakeTableAllocator extends TableAllocatorBase<ISnakeTableAllocatorSettings> implements ICompetitorAllocator<ITableCompetitorInfos> {
    public type: CompetitorAllocatorEnum.SnakeTableAllocator;

    public constructor(settings?: ISnakeTableAllocatorSettings) {
        super(settings);
    }

    public generateAllocation(competitorInfos: ICompetitiorInfo[]): ITableCompetitorInfos {
        return [];
    }
}