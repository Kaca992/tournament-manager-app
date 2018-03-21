import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';

import './main.scss';
import { Container, Menu, Sidebar, Icon, Header, Segment, Transition, Loader } from 'semantic-ui-react';
import { CategoryDuck } from '../../ducks/categories.duck';
import NavigationMenu from '../navigationMenu/navigationMenu';
import CompetititonsMenuContainer from '../competititonsMenu/competititonsMenu';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import { ControlTypeEnum } from '../../common/enums';
import CompetitionCreatorWizard from '../competitionCreatorWizard/competitionCreatorWizard';

export interface IMainProps {
    UI: {
        selectedControl: ControlTypeEnum,
        isCategoriesInitializing: boolean;
        isCompetitionVisible: boolean;
    };

    getCategories(): void;
}

export interface IMainState {

}

function mapStateToProps(state: IStore): Partial<IMainProps> {
    return {
        UI: {
            selectedControl: state.main.selectedControl,
            isCategoriesInitializing: state.categories.isInitializing,
            isCompetitionVisible: state.main.isCompetitionVisible
        }
    };
}

function mapDispatchToProps(dispatch: any): Partial<IMainProps> {
    return {
        getCategories: () => dispatch(CategoryDuck.actionCreators.getCategories()),
    };
}

class Main extends React.Component<IMainProps, IMainState> {
    constructor(props: IMainProps) {
        super(props);

    }

    componentDidMount() {
        this.props.getCategories();
    }

    render() {
        const {
            isCategoriesInitializing,
            isCompetitionVisible
        } = this.props.UI;

        const isAppInitializing = isCategoriesInitializing;

        return (
            <div className="app-container">
                <Menu borderless className='app-top-menu'>
                    <Menu.Item header className='app'>Tournament Manager</Menu.Item>
                </Menu>

                {isAppInitializing && <Loader className='app-main-loader' active size='massive' >{LocalizationProvider.Strings.mainLoadingText}</Loader>}
                {!isAppInitializing && this._renderContent()}
            </div>
        );
    }

    @autobind
    _renderContent() {
        switch(this.props.UI.selectedControl) {
            case ControlTypeEnum.Main:
                return this._renderMainContent();
            case ControlTypeEnum.CompetitionWizard:
                return this._renderCompetitionWizard();
            default:
                return null;
        }
    }

    @autobind
    _renderCompetitionWizard() {
        return <CompetitionCreatorWizard />;
    }

    @autobind
    _renderMainContent() {
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
                    <Header as='h3'>Application Content</Header>
                </Container>
            </Container>
        </Container>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
