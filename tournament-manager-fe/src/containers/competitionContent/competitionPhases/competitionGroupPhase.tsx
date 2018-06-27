import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './competitionGroupPhase.scss';
import { IStore } from '../../../store';
import { ICompetitionPhase, ICompetitionPhaseBaseCompetitor } from '../../../common/dataStructures/competition.phase';
import { CompetitionPhasesDuck } from '../../../ducks/competition.phases.duck';
import { Loader, Container, Header } from 'semantic-ui-react';
import { LocalizationProvider } from '../../../assets/localization/localizationProvider';
import CustomTable from '../../../components/customTable/customTable';
import _ = require('lodash');
import { getMatchInfoComponent } from '../../../components/matchInfoComponents';
import { IMatchInfo } from '../../../common/matchInfos';
import { CompetitionDuck } from '../../../ducks/competition.duck';
import { ICustomTableHeader } from '../../../components/customTable/customTable.utils';

export interface ICompetitionGroupPhaseOwnProps {

}

export interface ICompetitionGroupPhaseProps extends ICompetitionGroupPhaseOwnProps {
    phaseInfo: ICompetitionPhase;
    phaseCompetitorInfos: ICompetitionPhaseBaseCompetitor[];
    phaseMatches: IMatchInfo[];
    phasesInitializing: boolean;

    onSaveMatchInfo(newMatchInfo: IMatchInfo, removeMatch: boolean);
}

export interface ICompetitionGroupPhaseState {

}

function mapStateToProps(state: IStore, ownProps: ICompetitionGroupPhaseOwnProps): Partial<ICompetitionGroupPhaseProps> {
    return {
        phaseInfo: CompetitionPhasesDuck.selectors.getSelectedPhaseInfo(state),
        phasesInitializing: state.competitionPhases.initializing.phasesListInitializing,
        phaseCompetitorInfos: CompetitionPhasesDuck.selectors.getSelectedPhaseCompetitorInfos(state),
        phaseMatches: CompetitionPhasesDuck.selectors.getSelectedPhaseMatches(state)
    };
}

function mapDispatchToProps(dispatch: any): Partial<ICompetitionGroupPhaseProps> {
    return {
        onSaveMatchInfo: (newMatchInfo: IMatchInfo, removeMatch: boolean) => dispatch(CompetitionPhasesDuck.actionCreators.insertUpdateMatch(newMatchInfo, removeMatch))
    };
}

class CompetitionGroupPhase extends React.Component<ICompetitionGroupPhaseProps, ICompetitionGroupPhaseState> {
    constructor(props: ICompetitionGroupPhaseProps) {
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

        return <div className='competition-group' key={groupIndex}>
            <Header as='h2'> Grupa {groupIndex + 1} </Header>
            <CustomTable
                key={groupIndex}
                headers={phaseTableColumns}
                data={competitorsByGroup}
            />

            <div className='competition-group-schedule_container'>
                {getMatchInfoComponent(this.props.phaseInfo.settings.competitionType, { competitorsByGroup, matchesByGroup, onSaveMatchInfo: this.props.onSaveMatchInfo })}
            </div>
        </div>;
    }

    public render() {
        const { phasesInitializing, phaseInfo, phaseCompetitorInfos, phaseMatches } = this.props;
        if (phasesInitializing) {
            return <Loader className='app-main-loader' active size='massive' >{LocalizationProvider.Strings.mainLoadingText}</Loader>;
        } else if (!phaseInfo) {
            return "Morate generirati raspored na admin tabu";
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

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionGroupPhase);
