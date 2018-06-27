import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { Header, Menu, Segment, Container, Loader } from 'semantic-ui-react';

import { IStore } from '../../store';

import './competitionContent.scss';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import CompetitionPlayers from './competitionPlayers/competitionPlayers';
import CompetitionGroupPhase from './competitionPhases/competitionGroupPhase';
import CompetitionAdmin from './admin/admin';
import { CompetitionPhasesDuck } from '../../ducks/competition.phases.duck';
import { ICompetitionPhase } from 'data_structures/competition.phase';
import { CompetitionPhaseTypeEnum } from 'enums';

enum MenuType {
    Players = 'players',
    Admin = 'admin',
    Phase = 'phase'
}

export interface ICompetitionContentProps {
    selectedCompetitionId: number;
    selectedPhaseInfoId: number;
    competitionPhases: ICompetitionPhase[] | undefined;
    competitionPhasesInitializing: boolean;

    onSelectedPhaseChanged(selectedPhaseId: number);
}

export interface ICompetitionContentState {
    selectedMenuItem: MenuType;
    selectedPhaseId: number;
}

function mapStateToProps(state: IStore): Partial<ICompetitionContentProps> {
    return {
        selectedCompetitionId: state.competitionStructure.selectedCompetitionId,
        selectedPhaseInfoId: state.competitionPhases.selectedPhaseId,
        competitionPhases: state.competitionPhases.competitionPhases,
        competitionPhasesInitializing: state.competitionPhases.initializing.phasesListInitializing
    };
}

function mapDispatchToProps(dispatch: any): Partial<ICompetitionContentProps> {
    return {
        onSelectedPhaseChanged: (selectedPhaseId: number) => dispatch(CompetitionPhasesDuck.actionCreators.selectCompetitionPhase(selectedPhaseId))
    };
}

class CompetitionContent extends React.Component<ICompetitionContentProps, ICompetitionContentState> {
    private localization = LocalizationProvider.Strings.Competition;

    constructor(props: ICompetitionContentProps) {
        super(props);

        this.state = {
            selectedMenuItem: MenuType.Players,
            selectedPhaseId: props.selectedPhaseInfoId
        };
    }

    @autobind
    private _handleMenuChanged(menuType: MenuType, phaseId: number = -1) {
        this.setState({
            selectedMenuItem: menuType,
            selectedPhaseId: phaseId
        });

        this.props.onSelectedPhaseChanged(phaseId);
    }

    @autobind
    private _renderMenu(menuType: MenuType) {
        if (menuType === MenuType.Players) {
            return <CompetitionPlayers />;
        }

        if (menuType === MenuType.Phase) {
            return <CompetitionGroupPhase />;
        }

        if (menuType === MenuType.Admin) {
            return <CompetitionAdmin />;
        }
    }

    @autobind
    private _renderCompetitionPhasesMenuItems() {
        const { competitionPhases } = this.props;
        const {selectedPhaseId, selectedMenuItem} = this.state;
        if (!competitionPhases) {
            return [];
        }

        const phaseMenuItems = competitionPhases.map((phase, index) => {
                const displayName = phase.displayName ? phase.displayName : phase.settings.competitionPhaseType === CompetitionPhaseTypeEnum.Table ?
                    'Grupna Faza' : 'Knouckout Faza';
                return <Menu.Item
                    key={`phases_${index}`}
                    name={`phases_${index}`}
                    content={displayName}
                    active={selectedMenuItem === MenuType.Phase && phase.competitionPhaseId === selectedPhaseId}
                    onClick={() => this._handleMenuChanged(MenuType.Phase, phase.competitionPhaseId)} />;
            });

        return phaseMenuItems;
    }

    public render() {
        const { selectedCompetitionId, competitionPhasesInitializing } = this.props;
        const { selectedMenuItem } = this.state;

        if (selectedCompetitionId === -1) {
            return <div className="no-competitions-selected-warning">
                {this.localization.selectCompetition}
            </div>;
        }

        if (competitionPhasesInitializing) {
            return <Loader className='app-main-loader' active size='massive' >{LocalizationProvider.Strings.mainLoadingText}</Loader>;
        }

        return (
            <div>
                <Menu pointing secondary>
                    <Menu.Item name={MenuType.Players} content={this.localization.playersMenuItem} active={selectedMenuItem === MenuType.Players} onClick={() => this._handleMenuChanged(MenuType.Players)} />
                    {...this._renderCompetitionPhasesMenuItems()}
                    <Menu.Menu position='right'>
                        <Menu.Item name={MenuType.Admin} active={selectedMenuItem === MenuType.Admin} onClick={() => this._handleMenuChanged(MenuType.Admin)} />
                    </Menu.Menu>
                </Menu>

                <Container fluid className='competition-content_container'>
                    {this._renderMenu(selectedMenuItem)}
                </Container>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionContent);
