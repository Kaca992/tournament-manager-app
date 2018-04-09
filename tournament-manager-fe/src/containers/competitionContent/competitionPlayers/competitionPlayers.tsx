import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../../store';

import './competitionPlayers.scss';
import { Table, Loader, Container, Button } from 'semantic-ui-react';
import CustomTable from '../../../components/customTable/customTable';
import { ICompetitorTableInfo } from '../../../common/dataStructures/competition';
import { ICustomTableHeader } from '../../../components/customTable/customTable.utils';
import { LocalizationProvider } from '../../../assets/localization/localizationProvider';
import { CompetitionPhasesDuck } from '../../../ducks/competition.phases.duck';
import { MainDuck } from '../../../ducks/main.duck';
import { FullPageControlTypeEnum } from '../../../common/enums';

export interface ICompetitionPlayersProps {
    competitorTableInfo?: ICompetitorTableInfo;
    competitorsInitializing: boolean;
    competitionInitialized: boolean;

    openCompetitorEditControl();
}

export interface ICompetitionPlayersState {

}

function mapStateToProps(state: IStore, ownProps: Partial<ICompetitionPlayersProps>): Partial<ICompetitionPlayersProps> {
    return {
        competitorTableInfo: state.competitions.competitors,
        competitorsInitializing: state.competitions.competitorsInitializing,
        competitionInitialized: CompetitionPhasesDuck.selectors.competitionInitialized(state)
    };
}

function mapDispatchToProps(dispatch: any): Partial<ICompetitionPlayersProps> {
    return {
        openCompetitorEditControl: () => dispatch(MainDuck.actionCreators.openFullPageControl(FullPageControlTypeEnum.EditCompetitors))
    };
}

class CompetitionPlayers extends React.Component<ICompetitionPlayersProps, ICompetitionPlayersState> {
    constructor(props: ICompetitionPlayersProps) {
        super(props);

    }

    public render() {
        const { competitorTableInfo, competitorsInitializing, competitionInitialized, openCompetitorEditControl } = this.props;

        if (!competitorTableInfo || competitorsInitializing) {
            return <Loader className='app-main-loader' active size='massive' >{LocalizationProvider.Strings.mainLoadingText}</Loader>;
        }

        return (
            <Container fluid>
                {<Button className='competitors-edit-button' secondary icon='edit' content={LocalizationProvider.Strings.UpdateCompetitors.buttonText} onClick={openCompetitorEditControl} />}
                <CustomTable
                    headers={competitorTableInfo.columns}
                    data={competitorTableInfo.competitors}
                />
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionPlayers);
