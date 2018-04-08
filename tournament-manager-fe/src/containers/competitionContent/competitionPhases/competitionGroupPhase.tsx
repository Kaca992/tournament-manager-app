import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../../store';
import { ICompetitionPhase } from '../../../common/dataStructures/competition';
import { CompetitionPhasesDuck } from '../../../ducks/competition.phases.duck';
import { Loader } from 'semantic-ui-react';
import { LocalizationProvider } from '../../../assets/localization/localizationProvider';

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

    public render() {
        const { phasesInitializing, phaseInfo } = this.props;
        if (!phaseInfo || phasesInitializing) {
            return <Loader className='app-main-loader' active size='massive' >{LocalizationProvider.Strings.mainLoadingText}</Loader>;
        }

        return (
            <div>
                Hello
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionGroupPhase);
