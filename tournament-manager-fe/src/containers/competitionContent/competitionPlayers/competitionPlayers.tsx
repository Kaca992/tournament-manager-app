import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../../store';

import './competitionPlayers.scss';
import { Table, Loader } from 'semantic-ui-react';
import CustomTable from '../../../components/customTable/customTable';
import { ICompetitorTableInfo } from '../../../common/dataStructures/competition';
import { ICustomTableHeader } from '../../../components/customTable/customTable.utils';
import { LocalizationProvider } from '../../../assets/localization/localizationProvider';

export interface ICompetitionPlayersProps {
    competitorTableInfo?: ICompetitorTableInfo;
    competitorsInitializing: boolean;
}

export interface ICompetitionPlayersState {

}

function mapStateToProps(state: IStore, ownProps: Partial<ICompetitionPlayersProps>): Partial<ICompetitionPlayersProps> {
    return {
        competitorTableInfo: state.competitions.competitors,
        competitorsInitializing: state.competitions.competitorsInitializing
    };
}

function mapDispatchToProps(dispatch: any): Partial<ICompetitionPlayersProps> {
    return {

    };
}

class CompetitionPlayers extends React.Component<ICompetitionPlayersProps, ICompetitionPlayersState> {
    constructor(props: ICompetitionPlayersProps) {
        super(props);

    }

    public render() {
        const { competitorTableInfo, competitorsInitializing } = this.props;

        if (!competitorTableInfo || competitorsInitializing) {
            return <Loader className='app-main-loader' active size='massive' >{LocalizationProvider.Strings.mainLoadingText}</Loader>;
        }

        return (
            <CustomTable
                headers={competitorTableInfo.columns}
                data={competitorTableInfo.competitors}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionPlayers);
