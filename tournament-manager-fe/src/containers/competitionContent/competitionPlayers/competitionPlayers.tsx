import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../../store';

import './competitionPlayers.scss';
import { Table } from 'semantic-ui-react';
import CustomTable from '../../../components/customTable/customTable';

export interface ICompetitionPlayersProps {

}

export interface ICompetitionPlayersState {

}

function mapStateToProps(state: IStore, ownProps: Partial<ICompetitionPlayersProps>): ICompetitionPlayersProps {
    return {

    };
}

function mapDispatchToProps(dispatch: any): ICompetitionPlayersProps {
    return {

    };
}

class CompetitionPlayers extends React.Component<ICompetitionPlayersProps, ICompetitionPlayersState> {
    constructor(props: ICompetitionPlayersProps) {
        super(props);

    }

    public render() {
        return (
            <CustomTable />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionPlayers);
