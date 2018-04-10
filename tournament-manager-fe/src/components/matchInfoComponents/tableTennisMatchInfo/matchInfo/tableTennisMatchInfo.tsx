import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './tableTennisMatchInfo.scss';
import { ITableTennisMatchInfo } from '../../../../common/matchInfos';

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

    public render() {
        const { competitorName1, competitorName2, matchInfo, isEditing } = this.props;

        return (
            <div>
                <span>
                    {competitorName1}
                </span> vs.
                <span>
                    {competitorName2}
                </span>
            </div>
        );
    }
}
