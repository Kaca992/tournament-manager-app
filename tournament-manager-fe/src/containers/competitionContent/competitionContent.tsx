import { autobind } from 'core-decorators';
import { ICompetitionPhase } from 'data_structures/competition.phase';
import { CompetitionPhaseTypeEnum, MenuType } from 'enums';
import * as React from 'react';
import { connect } from 'react-redux';
import { Container, Loader, Menu } from 'semantic-ui-react';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import { CompetitionPhasesDuck } from '../../ducks/competition.phases.duck';
import { IStore } from '../../store';
import CompetitionAdmin from './admin/admin';
import './competitionContent.scss';
import CompetitionGroupPhaseContainer from './competitionPhases/groupPhase/competitionGroupPhaseContainer';
import CompetitionPlayers from './competitionPlayers/competitionPlayers';

export interface ICompetitionContentProps {
    selectedCompetitionId: number;
    selectedPhaseInfoId: number;
    selectedMenu: MenuType;
    competitionPhases: ICompetitionPhase[] | undefined;
    competitionPhasesInitializing: boolean;

    onSelectedPhaseChanged(selectedMenu: MenuType, selectedPhaseId: number);
}

function mapStateToProps(state: IStore): Partial<ICompetitionContentProps> {
    return {
        selectedCompetitionId: state.competitionStructure.selectedCompetitionId,
        selectedPhaseInfoId: state.competitionPhases.selectedPhaseId,
        selectedMenu: state.competitionPhases.selectedMenu,
        competitionPhases: state.competitionPhases.competitionPhases,
        competitionPhasesInitializing: state.competitionPhases.initializing.phasesListInitializing
    };
}

function mapDispatchToProps(dispatch: any): Partial<ICompetitionContentProps> {
    return {
        onSelectedPhaseChanged: (selectedMenu: MenuType, selectedPhaseId: number) => dispatch(CompetitionPhasesDuck.actionCreators.selectCompetitionPhase(selectedMenu, selectedPhaseId))
    };
}

class CompetitionContent extends React.Component<ICompetitionContentProps, {}> {
    private localization = LocalizationProvider.Strings.Competition;

    constructor(props: ICompetitionContentProps) {
        super(props);
    }

    @autobind
    private _handleMenuChanged(menuType: MenuType, phaseId: number = -1) {
        this.props.onSelectedPhaseChanged(menuType, phaseId);
    }

    @autobind
    private _renderMenu(menuType: MenuType) {
        if (menuType === MenuType.Players) {
            return <CompetitionPlayers />;
        }

        if (menuType === MenuType.Phase) {
            return <CompetitionGroupPhaseContainer />;
        }

        if (menuType === MenuType.Admin) {
            return <CompetitionAdmin />;
        }

        return;
    }

    @autobind
    private _renderCompetitionPhasesMenuItems() {
        const { competitionPhases, selectedMenu, selectedPhaseInfoId } = this.props;
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
                active={selectedMenu === MenuType.Phase && phase.competitionPhaseId === selectedPhaseInfoId}
                onClick={() => this._handleMenuChanged(MenuType.Phase, phase.competitionPhaseId)} />;
        });

        return phaseMenuItems;
    }

    public render() {
        const { selectedCompetitionId, competitionPhasesInitializing, selectedMenu } = this.props;

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
                    <Menu.Item name={MenuType.Players} content={this.localization.playersMenuItem} active={selectedMenu === MenuType.Players} onClick={() => this._handleMenuChanged(MenuType.Players)} />
                    {...this._renderCompetitionPhasesMenuItems()}
                    <Menu.Menu position='right'>
                        <Menu.Item name={MenuType.Admin} active={selectedMenu === MenuType.Admin} onClick={() => this._handleMenuChanged(MenuType.Admin)} />
                    </Menu.Menu>
                </Menu>

                <Container fluid className='competition-content_container'>
                    {this._renderMenu(selectedMenu)}
                </Container>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionContent);
