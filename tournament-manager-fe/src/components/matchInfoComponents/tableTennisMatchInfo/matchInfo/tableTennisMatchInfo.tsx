import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './tableTennisMatchInfo.scss';
import { ITableTennisMatchInfo, IMatchInfo } from '../../../../common/matchInfos';
import { Table, Icon } from 'semantic-ui-react';

export interface IMatchInput {
    id: number;
    value1: number;
    value2: number;
    errorMessage?: string;
}

export interface IMatchInputs {
    inputs: IMatchInput[];
}

export interface ITableTennisMatchInfoProps {
    competitorName1: string;
    competitorName2: string;
    matchInfo?: ITableTennisMatchInfo;
    isEditable?: boolean;
    isEditing?: boolean;

    onEditStart?(matchId: number);
    onSaveValue?(newMatchInfo: IMatchInfo);
    onCancelEdit?(matchId: number);
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

    @autobind
    private _renderEditActionsColumn() {
        const { isEditing } = this.props;
        return <Table.Cell className='action-cell' key={'edit'} width={3}>
            {!isEditing && <Icon name='edit' onClick={this._onEdit} />}
            {isEditing && <Icon name='save' onClick={this._onSaveValue} />}
            {isEditing && <Icon name='remove' onClick={this._onCancelEdit} />}
        </Table.Cell>;
    }

    @autobind
    private _onEdit() {
        if (this.props.onEditStart && this.props.matchInfo) {
            this.props.onEditStart(this.props.matchInfo.matchId);
        }
    }

    @autobind
    private _onCancelEdit() {
        if (this.props.onCancelEdit && this.props.matchInfo) {
            this.props.onCancelEdit(this.props.matchInfo.matchId);
        }
    }

    @autobind
    private _onSaveValue() {
        if (this.props.onSaveValue && this.props.matchInfo) {
            this.props.onSaveValue(this.props.matchInfo);
        }
    }

    public render() {
        const { competitorName1, competitorName2, matchInfo, isEditable, isEditing } = this.props;

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
