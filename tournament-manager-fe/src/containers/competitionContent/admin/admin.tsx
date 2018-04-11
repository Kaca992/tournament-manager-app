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
    export(fileName: string);
}

export interface ICompetitionAdminState {

}

function mapStateToProps(state: IStore): Partial<ICompetitionAdminProps> {
    return {

    };
}

function mapDispatchToProps(dispatch: any): Partial<ICompetitionAdminProps> {
    return {
        openNewCompetitionPhaseCreator: () => dispatch(MainDuck.actionCreators.openFullPageControl(FullPageControlTypeEnum.CreateNewCompetitionPhase)),
        export: (fileName) => dispatch(MainDuck.actionCreators.export(fileName))
    };
}

class CompetitionAdmin extends React.Component<ICompetitionAdminProps, ICompetitionAdminState> {
    constructor(props: ICompetitionAdminProps) {
        super(props);

    }

    @autobind
    private _onExport() {
        this.props.export("C:\\Users\\kacav\\Desktop\\test.xlsx");
    }

    public render() {
        return (
            <Container fluid textAlign='center'>
                <Button className='create-new-phase-button' secondary icon='add' content='Stvori Novu Fazu' onClick={this.props.openNewCompetitionPhaseCreator} />
                <Button className='export-button' secondary icon='print' content='Generiraj Dokumentaciju' onClick={this._onExport} />
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionAdmin);
