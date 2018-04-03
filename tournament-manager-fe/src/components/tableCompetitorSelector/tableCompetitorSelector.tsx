import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './tableCompetitorSelector.scss';
import CompetitorToken from '../competitorToken/competitorToken';
import CompetitorTokenList from '../competitorTokenList/competitorTokenList';
import _ = require('lodash');
import { Button, Icon, Popup } from 'semantic-ui-react';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import { ITableCompetitorInfos } from '../../common/dataStructures/common';
import { ICompetitorCreationInfo } from '../../common/dataStructures/competitionCreation';

export interface ITableCompetitorSelectorProps {
    competitors: ICompetitorCreationInfo[];
    competitorsAllocation: ITableCompetitorInfos;

    onCompetitorsAllocationChanged(newCompetitorsAllocation: ITableCompetitorInfos): void;
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
    private _onCompetitorTokenClicked(competitorInfo: ICompetitorCreationInfo) {
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

    @autobind
    private _onSwapButtonClicked() {
        const { selectedTokenIds } = this.state;
        const { competitorsAllocation, onCompetitorsAllocationChanged } = this.props;

        if (selectedTokenIds.length !== 2) {
            return;
        }

        let tokenIndexes: Array<{index: number, groupId: string, value: number}> = [];

        _.forEach(competitorsAllocation, (competitorIds, index) => {
            _.forEach(selectedTokenIds, (tokenId: number) => {
                const tokenIndex = competitorIds.findIndex(x => x.valueOf() === tokenId);
                if (tokenIndex !== -1) {
                    tokenIndexes.push({index: tokenIndex, groupId: index, value: tokenId});
                }
            });
        });

        const tokenIndex0 = tokenIndexes[0].value;
        tokenIndexes[0].value = tokenIndexes[1].value;
        tokenIndexes[1].value = tokenIndex0;
        const newCompetitorsAllocation = _.cloneDeep(competitorsAllocation);
        _.forEach(tokenIndexes, tokenIndex => {
            newCompetitorsAllocation[tokenIndex.groupId][tokenIndex.index] = tokenIndex.value;
        });

        onCompetitorsAllocationChanged(newCompetitorsAllocation);
        this.setState({
            selectedTokenIds: []
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

        return <Button primary className={buttonClassName} onClick={this._onSwapButtonClicked}>
            <Icon name='refresh' />
            {this.localizationStrings.swapButtonText}
        </Button>;
    }

    @autobind
    private _renderCompetitorTable(competitorIds: number[], groupId: string): JSX.Element {
        const {
            competitors
        } = this.props;

        let competitorInfos: ICompetitorCreationInfo[] = [];
        competitorIds.forEach(competitorId => {
            const competitor = competitors.find(x => x.id === competitorId);

            if (competitor) {
                competitorInfos.push(competitor);
            }
        });

        return <CompetitorTokenList
            key={groupId}
            id={groupId}
            headerText={`Group ${groupId + 1}`}
            selectedTokenIds={this.state.selectedTokenIds}
            competitorInfos={competitorInfos}
            onCompetitorTokenClicked={this._onCompetitorTokenClicked}
        />;
    }
}
