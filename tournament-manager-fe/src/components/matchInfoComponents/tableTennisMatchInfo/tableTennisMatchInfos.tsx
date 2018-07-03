import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './tableTennisMatchInfos.scss';
import { IMatchInfo, ITableTennisMatchInfo } from '../../../common/matchInfos';
import { ICompetitionPhaseBaseCompetitor } from '../../../common/dataStructures/competition.phase';
import TableTennisMatchInfo from './matchInfo/tableTennisMatchInfo';
import { Table } from 'semantic-ui-react';
import * as _ from 'lodash';

export interface IError {
    setIndex: number;
    isResultError?: boolean;
}

export interface ITableTennisMatchInfosProps {
    competitors: ICompetitionPhaseBaseCompetitor[];
    matches: IMatchInfo[];

    onSaveMatchInfo(newMatchInfo: IMatchInfo, removeMatch: boolean);
}

export interface ITableTennisMatchInfosState {
    editinigMatchInfo: IMatchInfo | null;
    errors: IError[];
    isValid: boolean;
}

export default class TableTennisMatchInfos extends React.Component<ITableTennisMatchInfosProps, ITableTennisMatchInfosState> {
    constructor(props: ITableTennisMatchInfosProps) {
        super(props);
        this.state = {
            editinigMatchInfo: null,
            errors: [],
            isValid: false
        };
    }

    @autobind
    private _getMaxLeg() {
        let maxLeg = -1;

        const { matches } = this.props;

        matches.map(match => {
            if (match.leg > maxLeg) {
                maxLeg = match.leg;
            }
        });

        return maxLeg;
    }

    @autobind
    private _generateHeader() {
        const iterator = _.times(5, (x) => x);
        return <Table.Header>
            <Table.HeaderCell width={2}>
                {""}
            </Table.HeaderCell>
            <Table.HeaderCell width={1}>
                {""}
            </Table.HeaderCell>
            <Table.HeaderCell width={2}>
                {""}
            </Table.HeaderCell>
            {
                iterator.map(index => {
                    return <Table.HeaderCell key={index} width={2}>
                        {`${index + 1}.set`}
                    </Table.HeaderCell>;
                })
            }
            <Table.HeaderCell>
                rez.
                </Table.HeaderCell>
            <Table.HeaderCell width={2} />
        </Table.Header>;
    }

    @autobind
    private _onSaveValue(matchInfo: IMatchInfo) {
        if (this.state.errors.length === 0 && this.state.isValid) {
            this.props.onSaveMatchInfo(matchInfo, false);
            this.setState({
                editinigMatchInfo: null,
                errors: [],
                isValid: false
            });
        }
    }

    @autobind
    private _onDeleteMatchInfo(matchInfo: IMatchInfo) {
        this.props.onSaveMatchInfo(matchInfo, true);
        this.setState({
            editinigMatchInfo: null,
            errors: [],
            isValid: false
        });
    }

    @autobind
    private _onMatchValueChanged(newMatchInfo: IMatchInfo, errors: IError[]) {
        this.setState({
            editinigMatchInfo: newMatchInfo,
            errors,
            isValid: true
        });
    }

    @autobind
    private _onEditStart(matchId: number) {
        const editinigMatchInfo = this.props.matches.find(x => x.matchId === matchId);

        this.setState({
            editinigMatchInfo: editinigMatchInfo ? editinigMatchInfo : null,
            errors: [],
            isValid: false
        });
    }

    @autobind
    private _onMatchCancelEdit(matchId: number) {
        this.setState({
            editinigMatchInfo: null,
            errors: [],
            isValid: false
        });
    }

    @autobind
    private _renderLeg(legId: number): JSX.Element {
        const { competitors, matches } = this.props;
        const { editinigMatchInfo, errors } = this.state;

        const competitorsPlayed: number[] = [];
        const legMatches = matches.filter(x => x.leg === legId);

        const matchElements = legMatches.map((match, index) => {
            const isEditing = editinigMatchInfo ? editinigMatchInfo.matchId === match.matchId : false;
            const competitor1 = competitors.find(x => x.competitorId === match.competitorId1) as ICompetitionPhaseBaseCompetitor;
            const competitor2 = competitors.find(x => x.competitorId === match.competitorId2) as ICompetitionPhaseBaseCompetitor;

            competitorsPlayed.push(competitor1.competitorId);
            competitorsPlayed.push(competitor2.competitorId);

            return <TableTennisMatchInfo
                key={index}
                matchInfo={isEditing ? editinigMatchInfo : match as any}
                errors={isEditing ? errors : []}
                competitorName1={competitor1.displayName}
                competitorName2={competitor2.displayName}
                isEditable={!editinigMatchInfo || isEditing}
                isEditing={isEditing}
                onValueChanged={this._onMatchValueChanged}
                onCancelEdit={this._onMatchCancelEdit}
                onEditStart={this._onEditStart}
                onSaveValue={this._onSaveValue}
                onDeleteValue={this._onDeleteMatchInfo}
            />;
        });

        if (competitorsPlayed.length !== competitors.length) {
            const competitorNotPlayed = competitors.filter(x => competitorsPlayed.findIndex(y => y === x.competitorId) === -1);
            matchElements.push(<TableTennisMatchInfo
                competitorName1={competitorNotPlayed[0].displayName}
                competitorName2={""}
                errors={[]}
            />);
        }

        return <Table compact key={legId}>
            {legId === 1 && this._generateHeader()}
            <Table.Body>
                {
                    ...matchElements
                }
            </Table.Body>
        </Table>;
    }

    public render() {
        const maxLeg = this._getMaxLeg();
        const legs: JSX.Element[] = [];
        for (let i = 1; i <= maxLeg; i++) {
            legs.push(this._renderLeg(i));
        }

        return (
            <div>
                {
                    ...legs
                }
            </div>
        );
    }
}
