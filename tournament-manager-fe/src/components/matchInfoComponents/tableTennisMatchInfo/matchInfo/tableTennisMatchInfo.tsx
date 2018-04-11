import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './tableTennisMatchInfo.scss';
import { ITableTennisMatchInfo, IMatchInfo } from '../../../../common/matchInfos';
import CustomInput from '../../../customInput/customInput';
import { Table, Icon, Input, InputOnChangeData } from 'semantic-ui-react';
import _ = require('lodash');
import { IError } from '../tableTennisMatchInfos';

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
    errors: IError[];
    isEditable?: boolean;
    isEditing?: boolean;

    onEditStart?(matchId: number);
    onSaveValue?(newMatchInfo: IMatchInfo);
    onValueChanged?(newMatchInfo: IMatchInfo, errors: IError[]);
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
        const { errors } = this.props;
        const errorMessage = errors.findIndex(x => x.setIndex === index) !== -1 ? ' ' : '';
        if (this.props.isEditing) {
            return <Table.Cell key={index} >
                    <CustomInput
                        className='input-cell'
                        containerClassName='input-cell_container'
                        maxLength={2}
                        type={'number'}
                        hideErrorIcon={true}
                        value={value1}
                        onChange={(value) => this._onSetValueChanged(index, value, 1)}
                        errorMessage={errorMessage}
                    />
                    <CustomInput
                        className='input-cell'
                        containerClassName='input-cell_container'
                        maxLength={2}
                        type={'number'}
                        hideErrorIcon={true}
                        value={value2}
                        onChange={(value) => this._onSetValueChanged(index, value, 2)}
                        errorMessage={errorMessage}
                    />
            </Table.Cell>;
        }

        return <Table.Cell key={index} width={2}>
            {value1 === null ? "" : `${value1} : ${value2}`}
        </Table.Cell>;
    }

    @autobind
    private _onSetValueChanged(setIndex: number, value: any, playerIndex: number) {
        const { matchInfo, onValueChanged, errors } = this.props;
        if (!matchInfo || !onValueChanged) {
            return;
        }

        const newMatchInfo = _.cloneDeep(matchInfo);
        const newErrors: IError[] = [];

        if (playerIndex === 1) {
            newMatchInfo.sets1[setIndex] = value;
        } else {
            newMatchInfo.sets2[setIndex] = value;
        }

        let result1 = 0;
        let result2 = 0;

        for (let index = 0; index < 5; index++) {
            if (newMatchInfo.sets1[index] && newMatchInfo.sets2[index]) {
                const val1 = parseInt(newMatchInfo.sets1[index], 10);
                const val2 = parseInt(newMatchInfo.sets2[index], 10);

                if (val1 > val2) {
                    result1 = result1 + 1;
                } else if (val1 < val2) {
                    result2 = result2 + 1;
                }

                if (val1 > 9 && val2 > 9 && ((val1 - val2) !== 2 && (val2 - val1) !== 2)) {
                    newErrors.push({setIndex: index});
                } else if (val1 < 11 && val2 < 11) {
                    newErrors.push({setIndex: index});
                }

            } else if (newMatchInfo.sets1[index] || newMatchInfo.sets2[index]) {
                newErrors.push({setIndex: index});
            }
        }

        if (result1 !== 3 && result2 !== 3) {
            newErrors.push({setIndex: -1, isResultError: true});
        }

        newMatchInfo.result = `${result1} : ${result2}`;
        onValueChanged(newMatchInfo, newErrors);
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
        const { competitorName1, competitorName2, matchInfo, isEditable, isEditing, errors } = this.props;
        const isResultError = errors.findIndex(x => x.isResultError === true) > -1;

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
                <Table.Cell width={2} >
                    {matchInfo ? matchInfo.result : ""}
                    {isResultError && <Icon name='exclamation' />}
                </Table.Cell>
                {isEditable && this._renderEditActionsColumn()}
                {!isEditable && <Table.Cell width={3} />}
            </Table.Row>
        );
    }
}
