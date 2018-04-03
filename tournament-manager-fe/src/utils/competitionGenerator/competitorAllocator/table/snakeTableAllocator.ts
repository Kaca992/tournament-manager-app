import { ICompetitorCreationInfo } from "../../../../common/dataStructures/competitionCreation";
import { ICompetitorAllocator, CompetitorAllocatorEnum } from "../competitorAllocator";
import { ITableAllocatorSettings, TableAllocatorBase } from "./table";
import _ = require("lodash");
import { ITableCompetitorInfos } from "../../../../common/dataStructures/common";

interface ISnakeTableAllocatorSettings extends ITableAllocatorSettings {

}

export class SnakeTableAllocator extends TableAllocatorBase<ISnakeTableAllocatorSettings> implements ICompetitorAllocator<ITableCompetitorInfos> {
    public type: CompetitorAllocatorEnum.SnakeTableAllocator;

    public constructor(settings?: ISnakeTableAllocatorSettings) {
        super(settings);
    }

    public generateAllocation(competitorInfos: ICompetitorCreationInfo[]): ITableCompetitorInfos {
        const allocatedCompetitors: ITableCompetitorInfos = [];
        let numberOfGroups: number = Math.floor(competitorInfos.length / this.settings.maxCompetitorsInTable);

        if (competitorInfos.length <= this.settings.minNumberOfCompetitors) {
            // too few players, all will be put in the same group
            numberOfGroups = 1;
        } else if (competitorInfos.length % this.settings.maxCompetitorsInTable !== 0) {
            // we have one more group with less players
            numberOfGroups = numberOfGroups + 1;
        }

        let competitors = competitorInfos.map(competitorInfo => {
            if (competitorInfo.ranking) {
                return competitorInfo;
            }

            return {
                ...competitorInfo,
                ranking: 0
            };
        });

        if (this.settings.orderByRanking) {
            competitors = _.sortBy(competitors, ['ranking']);
            competitors.reverse();
        }

        let groupIndex = 0;
        let groupIndexStep = 1;
        competitors.forEach(competitor => {
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
