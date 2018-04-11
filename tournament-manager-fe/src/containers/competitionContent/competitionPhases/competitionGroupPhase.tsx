import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './competitionGroupPhase.scss';
import { IStore } from '../../../store';
import { ICompetitionPhase, IGroupPhaseCompetitors, IGroupPhaseCompetitor } from '../../../common/dataStructures/competition';
import { CompetitionPhasesDuck } from '../../../ducks/competition.phases.duck';
import { Loader, Container, Header } from 'semantic-ui-react';
import { LocalizationProvider } from '../../../assets/localization/localizationProvider';
import CustomTable from '../../../components/customTable/customTable';
import _ = require('lodash');
import { getMatchInfoComponent } from '../../../components/matchInfoComponents';
import { IMatchInfo } from '../../../common/matchInfos';

export interface ICompetitionGroupPhaseOwnProps {

}

export interface ICompetitionGroupPhaseProps extends ICompetitionGroupPhaseOwnProps {
    phaseInfo: ICompetitionPhase;
    phasesInitializing: boolean;

    onSaveMatchInfo(newMatchInfo: IMatchInfo);
}

export interface ICompetitionGroupPhaseState {

}

function mapStateToProps(state: IStore, ownProps: ICompetitionGroupPhaseOwnProps): Partial<ICompetitionGroupPhaseProps> {
    return {
        phaseInfo: CompetitionPhasesDuck.selectors.getSelectedPhaseInfo(state),
        phasesInitializing: state.competitionPhases.phasesInitializing
    };
}

function mapDispatchToProps(dispatch: any): Partial<ICompetitionGroupPhaseProps> {
    return {
        onSaveMatchInfo: (newMatchInfo: IMatchInfo) => dispatch(CompetitionPhasesDuck.actionCreators.insertUpdateMatch(newMatchInfo))
    };
}

class CompetitionGroupPhase extends React.Component<ICompetitionGroupPhaseProps, ICompetitionGroupPhaseState> {
    constructor(props: ICompetitionGroupPhaseProps) {
        super(props);

    }

    @autobind
    private _renderGroup(index: string, competitors: number[], matches: IMatchInfo[], phaseCompetitors: IGroupPhaseCompetitors) {
        const competitorsByGroup: IGroupPhaseCompetitor[] = [];
        const groupIndex = parseInt(index, 10);
        competitors.map(competitorId => {
            const compIndex = phaseCompetitors.competitors.findIndex(x => x.competitorId === competitorId);
            if (compIndex !== -1) {
                competitorsByGroup.push(phaseCompetitors.competitors[compIndex]);
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
                headers={phaseCompetitors.columns}
                data={competitorsByGroup}
            />

            <div className='competition-group-schedule_container'>
                {getMatchInfoComponent(this.props.phaseInfo.settings.matchInfoType, { competitorsByGroup, matchesByGroup, onSaveMatchInfo: this.props.onSaveMatchInfo })}
            </div>
        </div>;
    }

    public render() {
        const { phasesInitializing, phaseInfo } = this.props;
        if (phasesInitializing) {
            return <Loader className='app-main-loader' active size='massive' >{LocalizationProvider.Strings.mainLoadingText}</Loader>;
        } else if (!phaseInfo) {
            return "Morate generirati raspored na admin tabu";
        }

        return (
            <div className='competition-phase_container'>
                {
                    _.map(phaseInfo.settings.competitorIds, (competitorsByGroup, index) => {
                        return this._renderGroup(index.toString(), competitorsByGroup, phaseInfo.phaseCompetitors.matches, phaseInfo.phaseCompetitors);
                    })
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionGroupPhase);
