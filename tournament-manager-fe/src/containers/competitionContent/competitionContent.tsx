import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { Header, Menu, Segment, Container } from 'semantic-ui-react';

import { IStore } from '../../store';

import './competitionContent.scss';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import CompetitionPlayers from './competitionPlayers/competitionPlayers';

export interface ICompetitionContentProps {

}

export interface ICompetitionContentState {

}

function mapStateToProps(state: IStore, ownProps: Partial<ICompetitionContentProps>): ICompetitionContentProps {
    return {

    };
}

function mapDispatchToProps(dispatch: any): ICompetitionContentProps {
    return {

    };
}

class CompetitionContent extends React.Component<ICompetitionContentProps, ICompetitionContentState> {
    private localization = LocalizationProvider.Strings.Competition;

    constructor(props: ICompetitionContentProps) {
        super(props);

    }

    @autobind
    private _handleMenuChanged(e, { name }) {
        alert(name);
        return;
    }

    public render() {
        return (
            <div>
                <Menu pointing secondary>
                    <Menu.Item name='players' content={this.localization.playersMenuItem} active onClick={this._handleMenuChanged} />
                    <Menu.Item name='messages' onClick={this._handleMenuChanged} />
                    <Menu.Item name='friends' onClick={this._handleMenuChanged} />
                    <Menu.Menu position='right'>
                        <Menu.Item name='logout' onClick={this._handleMenuChanged} />
                    </Menu.Menu>
                </Menu>

                <Container fluid className='competition-content_container'>
                    <CompetitionPlayers />
                </Container>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionContent);
