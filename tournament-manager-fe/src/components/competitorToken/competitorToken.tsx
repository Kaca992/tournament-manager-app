import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './competitorToken.scss';
import { ICompetitiorInfo } from '../../common/dataStructures';
import { Icon, Popup } from 'semantic-ui-react';

export interface ICompetitorTokenProps {
    competitorInfo: ICompetitiorInfo;
    isSelected?: boolean;
    className?: string;

    onClick?(): void;
}

export interface ICompetitorTokenState {

}

export default class CompetitorToken extends React.Component<ICompetitorTokenProps, ICompetitorTokenState> {
    constructor(props: ICompetitorTokenProps) {
        super(props);

    }

    @autobind
    private getLabelString(team: string | undefined, ranking: number | undefined) {
        let labelString = '';
        if (team) {
            labelString = labelString + team + ' ';
        }

        if (ranking) {
            labelString = `${labelString}(${ranking})`;
        }

        return labelString;
    }

    public render() {
        return <Popup
            trigger={this._renderToken()}
            content={this._renderTooltip()}
        />;
    }

    @autobind
    private _renderToken() {
        const {
            name,
            ranking,
            team
        } = this.props.competitorInfo;

        const {
            isSelected,
            className,
            onClick
        } = this.props;

        const containerClassName = classNames('competitor-token_container', className,
            { selected: isSelected }
        );

        const labelString = this.getLabelString(team, ranking);

        return (
            <div className={containerClassName} onClick={onClick}>
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

    @autobind
    private _renderTooltip() {
        const {
            name,
            ranking,
            team
        } = this.props.competitorInfo;

        const labelString = this.getLabelString(team, ranking);

        return <div>
            <div>
                {name}
            </div>
            {
                labelString && <div>
                    {labelString}
                </div>
            }
        </div>;
    }
}
