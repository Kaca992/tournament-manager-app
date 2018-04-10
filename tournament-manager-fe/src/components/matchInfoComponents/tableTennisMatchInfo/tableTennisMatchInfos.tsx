import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './tableTennisMatchInfos.scss';
import { IMatchInfo } from '../../../common/matchInfos';
import { IGroupPhaseCompetitor } from '../../../common/dataStructures/competition';

export interface ITableTennisMatchInfosProps {
    competitors: IGroupPhaseCompetitor[];
    matches: IMatchInfo[];
}

export interface ITableTennisMatchInfosState {

}

export default class TableTennisMatchInfos extends React.Component<ITableTennisMatchInfosProps, ITableTennisMatchInfosState> {
    constructor(props: ITableTennisMatchInfosProps) {
        super(props);

    }

    public render() {
        return (
            <div>
                Hello
            </div>
        );
    }
}
