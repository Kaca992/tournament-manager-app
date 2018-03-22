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
}

export interface ICompetitionConfigOptions {
    competitionName?: string;
    categoryName?: string;
    categoryId?: number;
}
