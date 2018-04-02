import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './tableCompetitorSelector.scss';
import { ICompetitiorInfo, ITableCompetitorInfos } from '../../common/dataStructures';
import CompetitorToken from '../competitorToken/competitorToken';
import CompetitorTokenList from '../competitorTokenList/competitorTokenList';
import _ = require('lodash');
import { Button, Icon, Popup } from 'semantic-ui-react';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';

export interface ITableCompetitorSelectorProps {
    competitors: ICompetitiorInfo[];
    competitorsAllocation: ITableCompetitorInfos;
}

export interface ITableCompetitorSelectorState {
    selectedTokenIds: number[];
}

export default class TableCompetitorSelector extends React.Component<ITableCompetitorSelectorProps, ITableCompetitorSelectorState> {
    private localizationStrings = LocalizationProvider.Strings.Wizards.CompetitionCreator.TableCompetitonSelector;
    constructor(props: ITableCompetitorSelectorProps) {
        super(props);

        this.state = {
            selectedTokenIds: []
        };
    }

    @autobind
    private _onCompetitorTokenClicked(competitorInfo: ICompetitiorInfo) {
        const selectedTokenIds = _.clone(this.state.selectedTokenIds);

        // same token clicked, we need to deselect it
        const clickedIndex = selectedTokenIds.indexOf(competitorInfo.id);
        if (clickedIndex !== -1) {
            selectedTokenIds.splice(clickedIndex, 1);
        } else {
            // max 2 selected tokens
            if (selectedTokenIds.length === 2) {
                selectedTokenIds.shift();
            }

            selectedTokenIds.push(competitorInfo.id);
        }

        this.setState({
            selectedTokenIds
        });
    }

    public render() {
        const {
            competitorsAllocation
        } = this.props;

        const {
            selectedTokenIds
        } = this.state;

        let tables: JSX.Element[] = [];
        _.forEach(competitorsAllocation, (competitorIds, index) => {
            tables.push(this._renderCompetitorTable(competitorIds, index));
        });

        return (
            <div className='table-competitor-selector_container'>
                <div className='swap-button'>
                    <Popup
                        trigger={this._renderSwapButton()}
                        content={this.localizationStrings.swapButtonTooltip}
                    />
                </div>
                <div className='table-competitor-selector_tables'>
                    {
                        ...tables
                    }
                </div>
            </div>
        );
    }

    @autobind
    private _renderSwapButton() {
        const {
            selectedTokenIds
        } = this.state;

        const isEnabled = selectedTokenIds && selectedTokenIds.length === 2;
        const buttonClassName = classNames({
            'disabled-state': !isEnabled
        });

        return <Button primary className={buttonClassName}>
            <Icon name='refresh' />
            {this.localizationStrings.swapButtonText}
        </Button>;
    }

    @autobind
    private _renderCompetitorTable(competitorIds: number[], groupId: string): JSX.Element {
        const {
            competitors
        } = this.props;

        let competitorInfos: ICompetitiorInfo[] = [];
        competitorIds.forEach(competitorId => {
            const competitor = competitors.find(x => x.id === competitorId);

            if (competitor) {
                competitorInfos.push(competitor);
            }
        });

        return <CompetitorTokenList
            headerText={`Group ${groupId + 1}`}
            id={groupId}
            selectedTokenIds={this.state.selectedTokenIds}
            competitorInfos={competitorInfos}
            onCompetitorTokenClicked={this._onCompetitorTokenClicked}
        />;
    }
}
