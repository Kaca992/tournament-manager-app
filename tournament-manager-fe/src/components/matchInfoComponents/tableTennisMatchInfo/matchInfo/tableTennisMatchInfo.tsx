import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './tableTennisMatchInfo.scss';
import { ITableTennisMatchInfo } from '../../../../common/matchInfos';
import { Table, Icon } from 'semantic-ui-react';

export interface ITableTennisMatchInfoProps {
    competitorName1: string;
    competitorName2: string;
    matchInfo?: ITableTennisMatchInfo;
    isEditable?: boolean;

    onEditStart?();
    onSaveValue?(newMatchInfo: ITableTennisMatchInfo);
    onCancelEdit?(newMatchInfo: ITableTennisMatchInfo);
}

export interface ITableTennisMatchInfoState {
    newMatchInfo?: ITableTennisMatchInfo;
    isEditing: boolean;
}

export default class TableTennisMatchInfo extends React.Component<ITableTennisMatchInfoProps, ITableTennisMatchInfoState> {
    constructor(props: ITableTennisMatchInfoProps) {
        super(props);
        this.state = {
            newMatchInfo: props.matchInfo,
            isEditing: false
        };
    }

    @autobind
    private _renderSets() {
        const { newMatchInfo } = this.state;
        const columns: JSX.Element[] = [];
        if (!newMatchInfo || !newMatchInfo.sets1) {
            for (let index = 0; index < 5; index++) {
                columns.push(this._renderReadColumn(index, null, null));
            }
        } else {
            let i = 0;
            newMatchInfo.sets1.map((set, index) => {
                columns.push(this._renderReadColumn(index, set, newMatchInfo.sets2[index]));
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

    @autobind
    private _renderEditActionsColumn() {
        const { isEditing } = this.state;
        return <Table.Cell className='action-cell' key={'edit'} width={3}>
            {!isEditing && <Icon name='edit' />}
            {isEditing && <Icon name='save' />}
            {isEditing && <Icon name='remove' />}
        </Table.Cell>;
    }

    public render() {
        const { competitorName1, competitorName2, matchInfo, isEditable } = this.props;
        const { isEditing } = this.state;

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
                <Table.Cell width={2}>
                    {matchInfo ? matchInfo.result : ""}
                </Table.Cell>
                {isEditable && this._renderEditActionsColumn()}
                {!isEditable && <Table.Cell width={3} />}
            </Table.Row>
        );
    }
}
