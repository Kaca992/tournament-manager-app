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
    matches: IMatchInfo[];
}

export interface ITableTennisMatchInfosState {

}

export default class TableTennisMatchInfos extends React.Component<ITableTennisMatchInfosProps, ITableTennisMatchInfosState> {
    constructor(props: ITableTennisMatchInfosProps) {
        super(props);

    }

    @autobind
    private _filterMatches() {
        const filteredMatches: IMatchInfo[] = [];
        let maxLeg = -1;

        const { matches, competitorsByGroup} = this.props;

        matches.map(match => {
            if (competitorsByGroup.find(x => x.competitorId === match.competitorId1) || competitorsByGroup.find(x => x.competitorId === match.competitorId2)) {
                filteredMatches.push(match);
                if (match.leg > maxLeg) {
                    maxLeg = match.leg;
                }
            }
        });

        return {maxLeg, filteredMatches};
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
        </Table.Header>;
    }

    @autobind
    private _renderLeg(legId: number, matches: IMatchInfo[]): JSX.Element {
        const { competitorsByGroup } = this.props;
        const competitorsPlayed: number[] = [];
        const legMatches = matches.filter(x => x.leg === legId);

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
        const {maxLeg, filteredMatches} = this._filterMatches();
        const legs: JSX.Element[] = [];
        for (let i = 1; i <= maxLeg; i++) {
            legs.push(this._renderLeg(i, filteredMatches));
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
