import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './tableTennisMatchInfo.scss';
import { ITableTennisMatchInfo, IMatchInfo } from '../../../../common/matchInfos';
import CustomInput from '../../../customInput/customInput';
import { Table, Icon, Input, InputOnChangeData } from 'semantic-ui-react';
import _ = require('lodash');

export interface IMatchInput {
    id: number;
    value1: number;
    value2: number;
    errorMessage?: string;
}

export interface ITableTennisMatchInfoProps {
    competitorName1: string;
    competitorName2: string;
    matchInfo?: ITableTennisMatchInfo;
    isEditable?: boolean;
    isEditing?: boolean;

    onEditStart?(matchId: number);
    onSaveValue?(newMatchInfo: IMatchInfo);
    onValueChanged?(newMatchInfo: IMatchInfo);
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
        if (!matchInfo) {
            for (let index = 0; index < 5; index++) {
                columns.push(this._renderColumn(index, null, null));
            }
        } else {
            matchInfo.sets1.map((set, index) => {
                columns.push(this._renderColumn(index, set, matchInfo.sets2[index]));
            });
        }

        return columns;
    }

    @autobind
    private _renderColumn(index: number, value1: any, value2: any) {
        if (this.props.isEditing) {
            return <Table.Cell key={index} >
                    <CustomInput
                        className='input-cell'
                        containerClassName='input-cell_container'
                        value={value1}
                        maxLength={2}
                        type={'number'}
                        onChange={(value) => this._onSetValueChanged(index, value, 1)}
                    />
                    <CustomInput
                        className='input-cell'
                        containerClassName='input-cell_container'
                        value={value2}
                        maxLength={2}
                        type={'number'}
                        onChange={(value) => this._onSetValueChanged(index, value, 2)}
                    />
            </Table.Cell>;
        }

        return <Table.Cell key={index} width={2}>
            {value1 === null ? "" : `${value1} : ${value2}`}
        </Table.Cell>;
    }

    @autobind
    private _onSetValueChanged(setIndex: number, value: any, playerIndex: number) {
        const { matchInfo, onValueChanged } = this.props;
        if (!matchInfo || !onValueChanged) {
            return;
        }

        const newMatchInfo = _.cloneDeep(matchInfo);
        if (playerIndex === 1) {
            newMatchInfo.sets1[setIndex] = value;
        } else {
            newMatchInfo.sets2[setIndex] = value;
        }

        let result1 = 0;
        let result2 = 0;
        for (let index = 0; index < 5; index++) {
            if (newMatchInfo.sets1[index] && newMatchInfo.sets2[index]) {
                if (parseInt(newMatchInfo.sets1[index], 10) > parseInt(newMatchInfo.sets2[index], 10)) {
                    result1 = result1 + 1;
                } else if (parseInt(newMatchInfo.sets1[index], 10) < parseInt(newMatchInfo.sets2[index], 10)) {
                    result2 = result2 + 1;
                }
            }
        }

        newMatchInfo.result = `${result1} : ${result2}`;
        onValueChanged(newMatchInfo);
    }

    @autobind
    private _renderEditActionsColumn() {
        const { isEditing } = this.props;
        return <Table.Cell className='action-cell' key={'edit'} width={2}>
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
