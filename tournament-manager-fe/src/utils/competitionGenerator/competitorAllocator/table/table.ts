export interface ITableAllocatorSettings {
    orderByRanking: boolean;
    /** No group will have more than this number of players (unless number of players is lesser than minNumberOfCompetitors) */
    maxCompetitorsInTable: number;
    /** If <= than this number than all competitors will be put in the same group */
    minNumberOfCompetitors: number;
}

export abstract class TableAllocatorBase<TSettings extends ITableAllocatorSettings> {
    private static defaultSettings: ITableAllocatorSettings = {
        orderByRanking: true,
        maxCompetitorsInTable: 4,
        minNumberOfCompetitors: 5
    };

    protected settings: TSettings;
    protected constructor(settings) {
        this.settings = {...settings, ...TableAllocatorBase.defaultSettings};
    }
}
