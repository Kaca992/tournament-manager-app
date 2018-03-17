import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';

import './main.scss';
import { Container, Menu, Sidebar, Icon, Header, Segment, Transition } from 'semantic-ui-react';
import { CategoryDuck } from '../../ducks/categories.duck';
import CategoriesMenuContainer from '../categoriesMenu/categoriesMenu';
import CompetititonsMenuContainer from '../competititonsMenu/competititonsMenu';

export interface IMainProps {
    UI: {
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

        if (isCategoriesInitializing) {
            return <div>
                Loading...
            </div>;
        }

        return (
            <div className="app-container">
                <Menu borderless className='app-top-menu'>
                    <Menu.Item header className='app'>Tournament Manager</Menu.Item>
                </Menu>
                <Container fluid className="app-central-container">
                    <CategoriesMenuContainer />
                    <Container fluid className="app-content-container">
                        <Transition.Group animation='slide right' duration={200}>
                            {isCompetitionVisible &&  <CompetititonsMenuContainer />}
                        </Transition.Group>
                        <Container fluid className="app-content">
                            <Header as='h3'>Application Content</Header>
                        </Container>
                    </Container>
                </Container>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
