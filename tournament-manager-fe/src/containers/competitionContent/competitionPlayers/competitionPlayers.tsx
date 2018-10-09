import { ICompetitorInfo } from '@data_structures/competition';
import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Container, Loader } from 'semantic-ui-react';
import { LocalizationProvider } from '../../../assets/localization/localizationProvider';
import { FullPageControlTypeEnum } from '../../../common/enums';
import CustomTable from '../../../components/customTable/customTable';
import { ICustomTableHeader } from '../../../components/customTable/customTable.utils';
import { MainDuck } from '../../../ducks/main.duck';
import { IStore } from '../../../store';
import './competitionPlayers.scss';

export interface ICompetitionPlayersProps {
    competitors?: ICompetitorInfo[];
    competitorColumns?: ICustomTableHeader[];
    competitorsInitializing: boolean;

    openCompetitorEditControl();
}

export interface ICompetitionPlayersState {

}

function mapStateToProps(state: IStore, ownProps: Partial<ICompetitionPlayersProps>): Partial<ICompetitionPlayersProps> {
    return {
        competitors: state.competitions.competitors,
        competitorColumns: state.competitions.competitorColumns,
        competitorsInitializing: state.competitions.competitorsInitializing
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
        const { competitors, competitorColumns, competitorsInitializing, openCompetitorEditControl } = this.props;

        if (!competitors || competitorsInitializing) {
            return <Loader className='app-main-loader' active size='massive' >{LocalizationProvider.Strings.mainLoadingText}</Loader>;
        }

        return (
            <Container fluid>
                {<Button className='competitors-edit-button' secondary icon='edit' content={LocalizationProvider.Strings.UpdateCompetitors.buttonText} onClick={openCompetitorEditControl} />}
                <CustomTable
                    headers={competitorColumns ? competitorColumns : []}
                    data={competitors}
                    isTableSortable={true}
                />
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionPlayers);
