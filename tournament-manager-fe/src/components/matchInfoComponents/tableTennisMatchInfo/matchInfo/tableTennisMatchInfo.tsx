import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './tableTennisMatchInfo.scss';
import { ITableTennisMatchInfo } from '../../../../common/matchInfos';
import { Table } from 'semantic-ui-react';

export interface ITableTennisMatchInfoProps {
    competitorName1: string;
    competitorName2: string;
    matchInfo?: ITableTennisMatchInfo;
    isEditing?: boolean;
}

export interface ITableTennisMatchInfoState {

}

export default class TableTennisMatchInfo extends React.Component<ITableTennisMatchInfoProps, ITableTennisMatchInfoState> {
    constructor(props: ITableTennisMatchInfoProps) {
        super(props);

    }

    @autobind
    private _renderSets() {
        const { matchInfo } = this.props;
        const columns: JSX.Element[] = [];
        if (!matchInfo || !matchInfo.sets1) {
            for (let index = 0; index < 5; index++) {
                columns.push(this._renderReadColumn(index, null, null));
            }
        } else {
            let i = 0;
            matchInfo.sets1.map((set, index) => {
                columns.push(this._renderReadColumn(index, set, matchInfo.sets2[index]));
                i++;
            });

            for (let index = i; index < 5; index++) {
                columns.push(this._renderReadColumn(index, null, null));
            }
        }

        return columns;
    }

    @autobind
    private _renderReadColumn(index: number, value1: any, value2: any) {
        return <Table.Cell key={index} width={2}>
            {value1 === null ? "" : `${value1} : ${value2}`}
        </Table.Cell>;
    }

    public render() {
        const { competitorName1, competitorName2, matchInfo, isEditing } = this.props;

        return (
            <Table.Row>
                <Table.Cell width={2}>
                    {competitorName1}
                </Table.Cell>
                <Table.Cell width={1}>
                    vs.
                </Table.Cell>
                <Table.Cell width={2}>
                    {competitorName2}
                </Table.Cell>
                {...this._renderSets()}
                <Table.Cell>
                    {matchInfo ? matchInfo.result : ""}
                </Table.Cell>
            </Table.Row>
        );
    }
}
