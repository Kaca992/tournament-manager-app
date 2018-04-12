import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../../store';
import { MainDuck } from '../../../ducks/main.duck';
import { FullPageControlTypeEnum } from '../../../common/enums';
import { Container, Button } from 'semantic-ui-react';

import './admin.scss';

export interface ICompetitionAdminProps {
    openNewCompetitionPhaseCreator();
    export(fileName: string);
    exportSchedule(fileName: string);
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
        export: (fileName) => dispatch(MainDuck.actionCreators.export(fileName)),
        exportSchedule: (fileName) => dispatch(MainDuck.actionCreators.exportSchedule(fileName))
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

    @autobind
    private _onExportSchedule() {
        this.props.exportSchedule("C:\\Users\\kacav\\Desktop\\test.xlsx");
    }

    public render() {
        return (
            <Container className='admin-container' fluid textAlign='center'>
                <Button className='create-new-phase-button' secondary icon='add' content='Stvori Novu Fazu' onClick={this.props.openNewCompetitionPhaseCreator} />
                <Button className='export-button' secondary icon='print' content='Generiraj Dokumentaciju' onClick={this._onExport} />
                <Button className='export-button' secondary icon='print' content='Generiraj Tablice i Raspored/Rezultate' onClick={this._onExportSchedule} />
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionAdmin);
