import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './tableTennisMatchInfo.scss';
import { ITableTennisMatchInfo } from '../../../common/matchInfos';

export interface ITableTennisMatchInfoProps {
    matchInfo: ITableTennisMatchInfo;
    isEditing: boolean;
}

export interface ITableTennisMatchInfoState {

}

export default class TableTennisMatchInfo extends React.Component<ITableTennisMatchInfoProps, ITableTennisMatchInfoState> {
    constructor(props: ITableTennisMatchInfoProps) {
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
