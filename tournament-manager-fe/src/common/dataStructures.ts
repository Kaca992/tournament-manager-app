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
    competitors: ICompetitiorInfo[];
}

export interface ICompetitionConfigOptions {
    createNewCategory?: boolean;
    competitionName?: string;
    categoryName?: string;
    categoryId?: number;
}

export interface ICompetitiorInfo {
    id: number;
    name?: string;
    team?: string;
    ranking?: number;
    errorMessage?: string;
}
