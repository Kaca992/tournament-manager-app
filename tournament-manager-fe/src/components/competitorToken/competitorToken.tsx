import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './competitorToken.scss';
import { ICompetitiorInfo } from '../../common/dataStructures';
import { Icon } from 'semantic-ui-react';

export interface ICompetitorTokenProps {
    competitorInfo: ICompetitiorInfo;
    isSelected?: boolean;
    className?: string;
}

export interface ICompetitorTokenState {

}

export default class CompetitorToken extends React.Component<ICompetitorTokenProps, ICompetitorTokenState> {
    constructor(props: ICompetitorTokenProps) {
        super(props);

    }

    render() {
        const {
            name,
            ranking,
            team
        } = this.props.competitorInfo;

        const {
            isSelected,
            className
        } = this.props;

        const containerClassName = classNames('competitor-token_container', className,
            {selected: isSelected}
        );

        let labelString = '';
        if (team) {
            labelString = labelString + team + ' ';
        }

        if (ranking) {
            labelString = `${labelString}(${ranking})`;
        }

        return (
            <div className={containerClassName}>
                <Icon size='large' name='user' />
                <span className='competitor-token_text'>
                    <div className='competitor-token_name'>
                        {`${name}`}
                    </div>
                    {labelString && <div className='competitor-token_team'>
                        {labelString}
                    </div>}
                </span>
            </div>
        );
    }
}
