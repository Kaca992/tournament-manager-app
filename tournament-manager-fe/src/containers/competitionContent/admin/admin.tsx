import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../../store';
import { MainDuck } from '../../../ducks/main.duck';
import { FullPageControlTypeEnum } from '../../../common/enums';
import { Container, Button } from 'semantic-ui-react';

export interface ICompetitionAdminProps {
    openNewCompetitionPhaseCreator();
}

export interface ICompetitionAdminState {

}

function mapStateToProps(state: IStore): Partial<ICompetitionAdminProps> {
    return {

    };
}

function mapDispatchToProps(dispatch: any): Partial<ICompetitionAdminProps> {
    return {
        openNewCompetitionPhaseCreator: () => dispatch(MainDuck.actionCreators.openFullPageControl(FullPageControlTypeEnum.CreateNewCompetitionPhase))
    };
}

class CompetitionAdmin extends React.Component<ICompetitionAdminProps, ICompetitionAdminState> {
    constructor(props: ICompetitionAdminProps) {
        super(props);

    }

    public render() {
        return (
            <Container fluid>
                <Button className='create-new-phase-button' secondary icon='add' content='Stvori Novu Fazu' onClick={this.props.openNewCompetitionPhaseCreator} />
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionAdmin);
