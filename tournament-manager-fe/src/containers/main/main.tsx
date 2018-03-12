import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';

import './main.scss';
import { Container, Menu, Sidebar, Icon, Header, Segment } from 'semantic-ui-react';

export interface IMainProps {

}

export interface IMainState {

}

function mapStateToProps(state: IStore): Partial<IMainProps> {
    return {

    };
}

function mapDispatchToProps(dispatch: any): Partial<IMainProps> {
    return {

    };
}

class Main extends React.Component<IMainProps, IMainState> {
    constructor(props: IMainProps) {
        super(props);

    }

    // componentDidMount() {

    // }

    render() {
        return (
            <div className="app-container">
                <Menu borderless className='app-top-menu'>
                    <Menu.Item header className='app'>Tournament Manager</Menu.Item>
                </Menu>
                <Container fluid className="app-central-container">
                    <Menu animation='push' width='thin' visible={true} icon='labeled' inverted vertical className="app-left-category-menu">
                        <Menu.Item name='home' onClick={() => alert('bok')}>
                            <Icon name='home' />
                            Home
                            </Menu.Item>
                        <Menu.Item name='gamepad'>
                            <Icon name='gamepad' />
                            Games
                            </Menu.Item>
                        <Menu.Item name='camera'>
                            <Icon name='camera' />
                            Channels
                            </Menu.Item>
                    </Menu>
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
