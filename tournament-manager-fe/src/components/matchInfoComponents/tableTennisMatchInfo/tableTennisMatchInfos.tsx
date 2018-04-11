import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './tableTennisMatchInfos.scss';
import { IMatchInfo } from '../../../common/matchInfos';
import { IGroupPhaseCompetitor } from '../../../common/dataStructures/competition';
import TableTennisMatchInfo from './matchInfo/tableTennisMatchInfo';
import { Table } from 'semantic-ui-react';
import _ = require('lodash');

export interface ITableTennisMatchInfosProps {
    competitorsByGroup: IGroupPhaseCompetitor[];
    matchesByGroup: IMatchInfo[];
}

export interface ITableTennisMatchInfosState {
    matchesByGroup: IMatchInfo[];
}

export default class TableTennisMatchInfos extends React.Component<ITableTennisMatchInfosProps, ITableTennisMatchInfosState> {
    constructor(props: ITableTennisMatchInfosProps) {
        super(props);
        this.state = {
            matchesByGroup: props.matchesByGroup
        }
    }

    @autobind
    private _getMaxLeg() {
        let maxLeg = -1;

        const { matchesByGroup} = this.props;

        matchesByGroup.map(match => {
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
    private _onMatchValueChanged(newMatchInfo: IMatchInfo) {
        const newMathces = _.clone(this.state.matchesByGroup);
        const matchIndex = this.state.matchesByGroup.findIndex(x => x.matchId === newMatchInfo.matchId);
        newMathces[matchIndex] = newMatchInfo;

        this.setState({
            matchesByGroup: newMathces
        });
    }

    @autobind
    private _onMatchCancelEdit(matchId: number) {
        const originalMatch = this.props.matchesByGroup.find(x => x.matchId === matchId);
        if (!originalMatch) {
            return;
        }

        const newMathces = this.state.matchesByGroup.map(match => {
            if (match.matchId !== matchId) {
                return match;
            }

            return originalMatch;
        });

        this.setState({
            matchesByGroup: newMathces
        });
    }

    @autobind
    private _renderLeg(legId: number): JSX.Element {
        const { competitorsByGroup } = this.props;
        const { matchesByGroup } = this.state;

        const competitorsPlayed: number[] = [];
        const legMatches = matchesByGroup.filter(x => x.leg === legId);

        const matchElements = legMatches.map((match, index) => {
            const competitor1 = competitorsByGroup.find(x => x.competitorId === match.competitorId1) as IGroupPhaseCompetitor;
            const competitor2 = competitorsByGroup.find(x => x.competitorId === match.competitorId2) as IGroupPhaseCompetitor;

            competitorsPlayed.push(competitor1.competitorId);
            competitorsPlayed.push(competitor2.competitorId);

            return <TableTennisMatchInfo
                key={index}
                matchInfo={match as any}
                competitorName1={competitor1.displayName}
                competitorName2={competitor2.displayName}
                isEditable={true}
                onCancelEdit={this._onMatchCancelEdit}
            />;
        });

        if (competitorsPlayed.length !== competitorsByGroup.length) {
            const competitorNotPlayed = competitorsByGroup.filter(x => competitorsPlayed.findIndex(y => y === x.competitorId) === -1);
            matchElements.push(<TableTennisMatchInfo
                competitorName1={competitorNotPlayed[0].displayName}
                competitorName2={""}
            />);
        }

        return <Table compact key={legId}>
            {legId === 1 && this._generateHeader()}
            {
                ...matchElements
            }
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