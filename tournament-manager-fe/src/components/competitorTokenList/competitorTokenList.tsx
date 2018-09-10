import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './competitorTokenList.scss';
import CompetitorToken from '../competitorToken/competitorToken';
import { ICompetitorCreationInfo } from '../../common/dataStructures/competitionCreation';

export interface ICompetitorTokenListProps {
    id: string;
    headerText: string;
    selectedTokenIds?: number[];

    competitorInfos: ICompetitorCreationInfo[];

    onCompetitorTokenClicked?(competitorInfo: ICompetitorCreationInfo): void;
}

export interface ICompetitorTokenListState {

}

export default class CompetitorTokenList extends React.Component<ICompetitorTokenListProps, ICompetitorTokenListState> {
    constructor(props: ICompetitorTokenListProps) {
        super(props);

    }

    @autobind
    private _onCompetitorTokenClicked(competitorInfo: ICompetitorCreationInfo) {
        if (this.props.onCompetitorTokenClicked) {
            this.props.onCompetitorTokenClicked(competitorInfo);
        }
    }

    public render() {
        const {
            competitorInfos,
            headerText,
            selectedTokenIds
        } = this.props;

        return (
            <div className='competitor-token-list_container'>
                <div>
                    {headerText}
                </div>
                <hr />
                {
                    competitorInfos.map(competitorInfo => {
                        return <CompetitorToken
                            key={competitorInfo.id}
                            competitorInfo={competitorInfo}
                            isSelected={selectedTokenIds && selectedTokenIds.indexOf(competitorInfo.id) !== -1}
                            onClick={this._onCompetitorTokenClicked}
                        />;
                    })
                }
            </div>
        );
    }
}
