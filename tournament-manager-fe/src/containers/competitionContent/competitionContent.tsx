import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { Header, Menu, Segment, Container } from 'semantic-ui-react';

import { IStore } from '../../store';

import './competitionContent.scss';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import CompetitionPlayers from './competitionPlayers/competitionPlayers';
import CompetitionGroupPhase from './competitionPhases/competitionGroupPhase';
import CompetitionAdmin from './admin/admin';

export interface ICompetitionContentProps {
    selectedCompetitionId: number;
}

export interface ICompetitionContentState {
    selectedMenuItem: string;
}

function mapStateToProps(state: IStore): Partial<ICompetitionContentProps> {
    return {
        selectedCompetitionId: state.competitionStructure.selectedCompetitionId
    };
}

function mapDispatchToProps(dispatch: any): Partial<ICompetitionContentProps> {
    return {

    };
}

class CompetitionContent extends React.Component<ICompetitionContentProps, ICompetitionContentState> {
    private localization = LocalizationProvider.Strings.Competition;

    constructor(props: ICompetitionContentProps) {
        super(props);

        this.state = {
            selectedMenuItem: 'players'
        };
    }

    @autobind
    private _handleMenuChanged(e, { name }) {
        this.setState({
            selectedMenuItem: name
        });
    }

    @autobind
    private _renderMenu(menuType: string) {
        if (menuType === 'players') {
            return <CompetitionPlayers />;
        }

        if (menuType === 'phases') {
            return <CompetitionGroupPhase />;
        }

        if (menuType === 'admin') {
            return <CompetitionAdmin />;
        }
    }

    public render() {
        const { selectedCompetitionId } = this.props;
        const { selectedMenuItem } = this.state;

        if (selectedCompetitionId === -1) {
            return <div>
                {this.localization.selectCompetition}
            </div>;
        }

        return (
            <div>
                <Menu pointing secondary>
                    <Menu.Item name='players' content={this.localization.playersMenuItem} active={selectedMenuItem === 'players'} onClick={this._handleMenuChanged} />
                    <Menu.Item name='phases' content='Grupna Faza' active={selectedMenuItem === 'phases'} onClick={this._handleMenuChanged} />
                    <Menu.Menu position='right'>
                        <Menu.Item name='admin' onClick={this._handleMenuChanged} />
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
