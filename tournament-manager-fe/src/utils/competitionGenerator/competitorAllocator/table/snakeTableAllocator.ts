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
        const allocatedCompetitors: ITableCompetitorInfos = [];
        let numberOfGroups: number = Math.floor(competitorInfos.length / this.settings.maxCompetitorsInTable);

        // we have one more group with less players
        if (competitorInfos.length % this.settings.maxCompetitorsInTable !== 0) {
            numberOfGroups = numberOfGroups + 1;
        }

        let groupIndex = 0;
        let groupIndexStep = 1;
        competitorInfos.forEach(competitor => {
            if (!allocatedCompetitors[groupIndex]) {
                allocatedCompetitors[groupIndex] = [];
            }

            allocatedCompetitors[groupIndex].push(competitor.id);

            if (groupIndex === (numberOfGroups - 1) && groupIndexStep !== -1) {
                groupIndexStep = -1;
            } else if (groupIndex === 0 && groupIndexStep !== 1) {
                groupIndexStep = 1;
            } else {
                groupIndex = groupIndex + groupIndexStep;
            }
        });

        return allocatedCompetitors;
    }
}