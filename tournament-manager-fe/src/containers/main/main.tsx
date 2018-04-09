import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';

import './main.scss';
import { Container, Menu, Sidebar, Icon, Header, Segment, Transition, Loader } from 'semantic-ui-react';
import NavigationMenu from '../navigationMenu/navigationMenu';
import CompetititonsMenuContainer from '../competititonsMenu/competititonsMenu';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import { ControlTypeEnum, DialogTypeEnum, FullPageControlTypeEnum } from '../../common/enums';
import CompetitionCreatorWizard from '../competitionCreatorWizard/competitionCreatorWizard';
import CompetitionCreatorWizardBase from '../competitionCreatorWizardBase/competitionCreatorWizardBase';
import EditCompetitors from '../competitionCompetitorsEdit/competitionCompetitorsEdit';
import CompetitionPhaseCreatorWizard from '../competitionPhaseCreatorWizard/competitionPhaseCreatorWizard';
import { CompetitionStructureDuck } from '../../ducks/competition.structure.duck';
import DialogContainer from '../dialogContainer/dialogContainer';
import CompetitionContent from '../competitionContent/competitionContent';

export interface IMainProps {
    UI: {
        selectedControl: ControlTypeEnum;
        selectedFullPageControl: FullPageControlTypeEnum;
        isCompetitionStructureInitializing: boolean;
        isCompetitionVisible: boolean;
    };

    getCompetitionStrucutre(): void;
}

export interface IMainState {

}

function mapStateToProps(state: IStore): Partial<IMainProps> {
    return {
        UI: {
            selectedControl: state.main.selectedControl,
            selectedFullPageControl: state.fullPageControl.selectedControl,
            isCompetitionStructureInitializing: state.competitionStructure.isInitializing,
            isCompetitionVisible: state.main.isCompetitionVisible
        }
    };
}

function mapDispatchToProps(dispatch: any): Partial<IMainProps> {
    return {
        getCompetitionStrucutre: () => dispatch(CompetitionStructureDuck.actionCreators.getCompetitionStrucutre()),
    };
}

class Main extends React.Component<IMainProps, IMainState> {
    constructor(props: IMainProps) {
        super(props);

    }

    public componentDidMount() {
        this.props.getCompetitionStrucutre();
    }

    public render() {
        const {
            isCompetitionStructureInitializing,
            isCompetitionVisible
        } = this.props.UI;

        const isAppInitializing = isCompetitionStructureInitializing;

        return (
            <div className="app-container">
                <Menu borderless className='app-top-menu'>
                    <Menu.Item header className='app'>Tournament Manager</Menu.Item>
                </Menu>

                {isAppInitializing && <Loader className='app-main-loader' active size='massive' >{LocalizationProvider.Strings.mainLoadingText}</Loader>}
                {!isAppInitializing && <DialogContainer />}
                {!isAppInitializing && this._renderContent()}
            </div>
        );
    }

    @autobind
    private _renderContent() {
        switch (this.props.UI.selectedControl) {
            case ControlTypeEnum.Main:
                return this._renderMainContent();
            case ControlTypeEnum.FullPageControl:
                return this._renderFullPageControl();
            default:
                return null;
        }
    }

    @autobind
    private _renderFullPageControl() {
        switch (this.props.UI.selectedFullPageControl) {
            case FullPageControlTypeEnum.CompetitionWizard:
                return <CompetitionCreatorWizard />;
            case FullPageControlTypeEnum.CompetitionWizardBase:
                return <CompetitionCreatorWizardBase />;
            case FullPageControlTypeEnum.EditCompetitors:
                return <EditCompetitors />;
            case FullPageControlTypeEnum.CreateNewCompetitionPhase:
                return <CompetitionPhaseCreatorWizard />;
            default:
                return null;
        }
    }

    @autobind
    private _renderMainContent() {
        const {
            isCompetitionVisible
        } = this.props.UI;

        return <Container fluid className="app-central-container">
            <NavigationMenu />
            <Container fluid className="app-content-container">
                <Transition.Group animation='slide right' duration={200}>
                    {isCompetitionVisible && <CompetititonsMenuContainer />}
                </Transition.Group>
                <Container fluid className="app-content">
                    <CompetitionContent />
                </Container>
            </Container>
        </Container>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
