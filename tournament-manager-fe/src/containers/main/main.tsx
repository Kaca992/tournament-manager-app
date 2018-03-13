import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';

import './main.scss';
import { Container, Menu, Sidebar, Icon, Header, Segment } from 'semantic-ui-react';
import { CategoryDuck } from '../../ducks/categories.duck';
import MainMenu from '../../components/mainMenu/mainMenu';
import { ICategory } from '../../common/dataStructures';

export interface IMainProps {
    UI: {
        isCategoriesInitializing: boolean;
    };

    categories: ICategory[];

    getCategories(): void;
}

export interface IMainState {

}

function mapStateToProps(state: IStore): Partial<IMainProps> {
    return {
        UI: {
            isCategoriesInitializing: state.categories.isInitializing
        },

        categories: state.categories.categories
    };
}

function mapDispatchToProps(dispatch: any): Partial<IMainProps> {
    return {
        getCategories: () => dispatch(CategoryDuck.actionCreators.getCategories())
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
            isCategoriesInitializing
        } = this.props.UI;

        const {
            categories
        } = this.props;

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
                    <MainMenu
                        isVisible={true}
                        menuItems={categories}
                        selectedMenuItem={1}
                        onMenuItemClick={() => alert('bok')}
                    />
                    <Container fluid className="app-content-container">
                        <Container fluid className="app-left-subcategory-menu">
                            <Header as='h3'>Application Content</Header>
                        </Container>
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
