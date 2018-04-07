import { SemanticWIDTHS } from "semantic-ui-react";

export interface ICustomTableHeader {
    displayText: string;
    headerKey: string;

    textAlign?: 'center' | 'left' | 'right';
    columns?: SemanticWIDTHS;
}
