import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';

import './main.scss';


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

    componentDidMount() {

    }

    render() {
        return (
            <div className="app-container">
                <div className="app-content">
                    Test
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
