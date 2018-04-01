import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './competitorTokenList.scss';
import { ICompetitiorInfo } from '../../common/dataStructures';
import CompetitorToken from '../competitorToken/competitorToken';

export interface ICompetitorTokenListProps {
    id: number;
    headerText: string;
    selectedTokenIds?: number[];

    competitorInfos: ICompetitiorInfo[];
}

export interface ICompetitorTokenListState {

}

export default class CompetitorTokenList extends React.Component<ICompetitorTokenListProps, ICompetitorTokenListState> {
    constructor(props: ICompetitorTokenListProps) {
        super(props);

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
                        />;
                    })
                }
            </div>
        );
    }
}
