import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './competitionGroupPhaseContainer.scss';
import { IStore } from '../../../../store';
import { ICompetitionPhase, ICompetitionPhaseBaseCompetitor } from '../../../../common/dataStructures/competition.phase';
import { CompetitionPhasesDuck } from '../../../../ducks/competition.phases.duck';
import { Loader, Container, Header } from 'semantic-ui-react';
import { LocalizationProvider } from '../../../../assets/localization/localizationProvider';
import CustomTable from '../../../../components/customTable/customTable';
import * as _ from 'lodash';
import { getMatchInfoComponent } from '../../../../components/matchInfoComponents';
import { IMatchInfo } from '../../../../common/matchInfos';
import { ICustomTableHeader } from '../../../../components/customTable/customTable.utils';
import { IInitializingStatus } from '../../../../common/interfaces';
import { InitializingStatusEnum } from 'enums';
import GroupContainer from './components/groupContainer';

export interface ICompetitionGroupPhaseContainerOwnProps {

}

export interface ICompetitionGroupPhaseContainerProps extends ICompetitionGroupPhaseContainerOwnProps {
    phaseInfo: ICompetitionPhase;
    phaseCompetitorInfos: ICompetitionPhaseBaseCompetitor[];
    phaseMatches: IMatchInfo[];
    phasesInitializing: boolean;
    phaseStatus: IInitializingStatus;

    onSaveMatchInfo(newMatchInfo: IMatchInfo, removeMatch: boolean);
}

export interface ICompetitionGroupPhaseContainerState {

}

function mapStateToProps(state: IStore, ownProps: ICompetitionGroupPhaseContainerOwnProps): Partial<ICompetitionGroupPhaseContainerProps> {
    return {
        phaseInfo: CompetitionPhasesDuck.selectors.getSelectedPhaseInfo(state),
        phasesInitializing: state.competitionPhases.initializing.phasesListInitializing,
        phaseCompetitorInfos: CompetitionPhasesDuck.selectors.getSelectedPhaseCompetitorInfos(state),
        phaseMatches: CompetitionPhasesDuck.selectors.getSelectedPhaseMatches(state),
        phaseStatus: CompetitionPhasesDuck.selectors.getSelectedPhaseStatus(state)
    };
}

function mapDispatchToProps(dispatch: any): Partial<ICompetitionGroupPhaseContainerProps> {
    return {
        onSaveMatchInfo: (newMatchInfo: IMatchInfo, removeMatch: boolean) => dispatch(CompetitionPhasesDuck.actionCreators.insertUpdateMatch(newMatchInfo, removeMatch))
    };
}

class CompetitionGroupPhaseContainer extends React.Component<ICompetitionGroupPhaseContainerProps, ICompetitionGroupPhaseContainerState> {
    constructor(props: ICompetitionGroupPhaseContainerProps) {
        super(props);

    }

    @autobind
    private _renderGroup(index: string, competitors: number[], matches: IMatchInfo[], phaseCompetitors: ICompetitionPhaseBaseCompetitor[], phaseTableColumns: ICustomTableHeader[]) {
        const competitorsByGroup: ICompetitionPhaseBaseCompetitor[] = [];
        const groupIndex = parseInt(index, 10);
        competitors.map(competitorId => {
            const compIndex = phaseCompetitors.findIndex(x => x.competitorId === competitorId);
            if (compIndex !== -1) {
                competitorsByGroup.push(phaseCompetitors[compIndex]);
            }
        });

        const matchesByGroup: IMatchInfo[] = [];
        matches.map(match => {
            if (match.groupIndex === groupIndex) {
                matchesByGroup.push(match);
            }
        });

        return <GroupContainer
            key={groupIndex}
            groupIndex={groupIndex}
            competitionType={this.props.phaseInfo.settings.competitionType}
            competitors={competitorsByGroup}
            matches={matchesByGroup}
            tableHeaders={phaseTableColumns}
            onSaveMatchInfo={this.props.onSaveMatchInfo}
        />;
    }

    public render() {
        const { phasesInitializing, phaseInfo, phaseCompetitorInfos, phaseMatches, phaseStatus } = this.props;
        if (phasesInitializing || phaseStatus.initializingStatus !== InitializingStatusEnum.Initialized) {
            return <Loader className='app-main-loader' active size='massive' >{LocalizationProvider.Strings.mainLoadingText}</Loader>;
        }

        return (
            <div className='competition-phase_container'>
                {
                    _.map(phaseInfo.settings.competitorIds, (competitorsByGroup, index) => {
                        return this._renderGroup(index.toString(), competitorsByGroup, phaseMatches, phaseCompetitorInfos, phaseInfo.phaseTableColumns);
                    })
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionGroupPhaseContainer);
