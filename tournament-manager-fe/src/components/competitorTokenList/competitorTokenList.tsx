import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './competitorTokenList.scss';
import { ICompetitiorInfo } from '../../common/dataStructures';
import CompetitorToken from '../competitorToken/competitorToken';

export interface ICompetitorTokenListProps {
    id: string;
    headerText: string;
    selectedTokenIds?: number[];

    competitorInfos: ICompetitiorInfo[];

    onCompetitorTokenClicked?(competitorInfo: ICompetitiorInfo): void;
}

export interface ICompetitorTokenListState {

}

export default class CompetitorTokenList extends React.Component<ICompetitorTokenListProps, ICompetitorTokenListState> {
    constructor(props: ICompetitorTokenListProps) {
        super(props);

    }

    @autobind
    private _onCompetitorTokenClicked(competitorInfo: ICompetitiorInfo) {
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
                <hr/>
                {
                    competitorInfos.map(competitorInfo => {
                        return <CompetitorToken
                            key={competitorInfo.id}
                            competitorInfo={competitorInfo}
                            isSelected={selectedTokenIds && selectedTokenIds.includes(competitorInfo.id)}
                            onClick={this._onCompetitorTokenClicked}
                        />;
                    })
                }
            </div>
        );
    }
}
