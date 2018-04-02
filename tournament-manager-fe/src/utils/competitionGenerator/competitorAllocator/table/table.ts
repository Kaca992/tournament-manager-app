export interface ITableAllocatorSettings {
    orderByRanking: boolean;
    maxCompetitorsInTable: number;
}

export abstract class TableAllocatorBase<TSettings extends ITableAllocatorSettings> {
    private static defaultSettings: ITableAllocatorSettings = {
        orderByRanking: true,
        maxCompetitorsInTable: 4
    };

    protected settings: TSettings;
    protected constructor(settings) {
        this.settings = {...settings, ...TableAllocatorBase.defaultSettings};
    }
}
