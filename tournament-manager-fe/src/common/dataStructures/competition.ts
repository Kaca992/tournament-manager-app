import { ICustomTableHeader } from "../../components/customTable/customTable.utils";

export interface ICompetitorTableInfo {
    competitors: ICompetitorInfo[];
    columns: ICustomTableHeader[];
}

export interface ICompetitorInfo {
    id: number;
    name: string;
    team: string;
    ranking?: number;
}
