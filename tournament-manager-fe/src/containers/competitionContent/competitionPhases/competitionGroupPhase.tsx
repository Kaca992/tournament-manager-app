import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './competitionGroupPhase.scss';
import { IStore } from '../../../store';
import { ICompetitionPhase, IGroupPhaseCompetitors } from '../../../common/dataStructures/competition';
import { CompetitionPhasesDuck } from '../../../ducks/competition.phases.duck';
import { Loader, Container, Header } from 'semantic-ui-react';
import { LocalizationProvider } from '../../../assets/localization/localizationProvider';
import CustomTable from '../../../components/customTable/customTable';
import _ = require('lodash');

export interface ICompetitionGroupPhaseOwnProps {

}

export interface ICompetitionGroupPhaseProps extends ICompetitionGroupPhaseOwnProps {
    phaseInfo: ICompetitionPhase;
    phasesInitializing: boolean;
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

    };
}

class CompetitionGroupPhase extends React.Component<ICompetitionGroupPhaseProps, ICompetitionGroupPhaseState> {
    constructor(props: ICompetitionGroupPhaseProps) {
        super(props);

    }

    @autobind
    private _renderGroup(groupIndex: number, competitorsByGroup: number[], phaseCompetitors: IGroupPhaseCompetitors) {
        const competitors = competitorsByGroup.map(competitorId => {
            return phaseCompetitors.competitors.find(x => x.competitorId === competitorId);
        });

        return <div className='competition-group' key={groupIndex}>
            <Header as='h2'> Grupa {groupIndex} </Header>
            <CustomTable
                key={groupIndex}
                headers={phaseCompetitors.columns}
                data={competitors}
            />
        </div>;
    }

    public render() {
        const { phasesInitializing, phaseInfo } = this.props;
        if (!phaseInfo || phasesInitializing) {
            return <Loader className='app-main-loader' active size='massive' >{LocalizationProvider.Strings.mainLoadingText}</Loader>;
        }

        return (
            <Container fluid className='competition-phase_container'>
                {
                    _.map(phaseInfo.settings.competitorIds, (competitorsByGroup, index) => {
                        return this._renderGroup(index, competitorsByGroup, phaseInfo.phaseCompetitors);
                    })
                }
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionGroupPhase);