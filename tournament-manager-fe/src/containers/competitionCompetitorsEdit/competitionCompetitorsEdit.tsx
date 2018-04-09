import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';

import Wizard, { WizardDirectionEnum } from '../../components/wizard/wizard';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import { ICompetitorCreationInfo } from '../../common/dataStructures/competitionCreation';
import { validateEmptyString, validateEmptyValue } from '../../utils/validation';
import CompetitionWizardPlayerForm from '../../components/competitionWizardPlayerForm/competitionWizardPlayerForm';
import { CompetitionDuck } from '../../ducks/competition.duck';
import { MainDuck } from '../../ducks/main.duck';
import { DialogDuck } from '../../ducks/dialog.duck';
import { ICompetitorInfo } from '../../common/dataStructures/competition';

export interface IEditCompetitorsOwnProps {

}

export interface IEditCompetitorsProps extends IEditCompetitorsOwnProps {
    competitionId: number;
    initialCompetitors: ICompetitorInfo[];

    editCompetitors(competitionId: number, competitors: ICompetitorInfo[]): Promise<any>;
    closeControl();
}

export interface IEditCompetitorsState {
    updatedCompetitors: ICompetitorCreationInfo[];
}

function mapStateToProps(state: IStore, ownProps: IEditCompetitorsOwnProps): Partial<IEditCompetitorsProps> {
    return {
        competitionId: state.competitionStructure.selectedCompetitionId,
        initialCompetitors: state.competitions.competitors ? state.competitions.competitors.competitors : []
    };
}

function mapDispatchToProps(dispatch: any): Partial<IEditCompetitorsProps> {
    return {
        editCompetitors: (competitionId: number, competitors: ICompetitorInfo[]) => dispatch(CompetitionDuck.actionCreators.updateCompetitors(competitionId, competitors)),
        closeControl: () => dispatch(MainDuck.actionCreators.closeFullPageControl())
    };
}

class EditCompetitors extends React.Component<IEditCompetitorsProps, IEditCompetitorsState> {
    private wizardStrings = LocalizationProvider.Strings.UpdateCompetitors;
    private wizardProps = {
        wizardTitle: this.wizardStrings.titleText,
        finishButtonText: this.wizardStrings.buttonText,
        hideSteps: true,

        wizardSteps: [{
            title: this.wizardStrings.titleText,
            description: ""
        }]
    };

    constructor(props: IEditCompetitorsProps) {
        super(props);
        this.state = {
            updatedCompetitors: props.initialCompetitors
        };
    }

    public render() {
        return (
            <Wizard
                    {...this.wizardProps}
                    stepWidths={4}
                    renderWizardContent={this._renderWizardContent}
                    onWizardFinish={this._onWizardFinish}
                    onCanceling={this._onCanceling}
            />
        );
    }

    @autobind
    private _renderWizardContent(stepIndex: number) {
        switch (stepIndex) {
            case 0:
                return this._renderPlayerPage();
        }

        throw new Error("Undefined wizard page");
    }

    @autobind
    private _renderPlayerPage() {
        return <CompetitionWizardPlayerForm
            competitors={this.state.updatedCompetitors}
            onCompetitorInfoChanged={this._onCompetitorInfoChanged}
            onCompetitorRemoved={this._onCompetitorRemoved}
        />;
    }

    @autobind
    private _onCompetitorInfoChanged(newCompetitorInfo: ICompetitorCreationInfo) {
        const {
            updatedCompetitors
        } = this.state;

        let competitors = [...updatedCompetitors];
        const oldCompetitorInfoIndex = updatedCompetitors.findIndex(x => x.id === newCompetitorInfo.id);
        // existing
        if (oldCompetitorInfoIndex !== -1) {
            competitors[oldCompetitorInfoIndex] = newCompetitorInfo;
        } else {
            competitors.push(newCompetitorInfo);
        }

        this.setState({
            updatedCompetitors: competitors
        });
    }

    @autobind
    private _onCompetitorRemoved(competitorId: number) {
        const {
            updatedCompetitors
        } = this.state;

        const competitors = updatedCompetitors.filter(competitor => competitor.id !== competitorId);
        this.setState({
            updatedCompetitors: competitors
        });
    }

    @autobind
    private _validateCompetitors(updatedCompetitors: ICompetitorCreationInfo[]): boolean {
        let areCompetitorsValid = true;
        const competitors = updatedCompetitors.map(competitor => {
            const competitorErrorMessage = validateEmptyString(competitor.name);
            areCompetitorsValid = areCompetitorsValid && !competitorErrorMessage;

            return {
                ...competitor,
                errorMessage: competitorErrorMessage
            };
        });

        this.setState({
            updatedCompetitors: competitors
        });

        return areCompetitorsValid;
    }

    @autobind
    private _onWizardFinish() {
        const { editCompetitors, competitionId } = this.props;
        const { updatedCompetitors } = this.state;

        if (this._validateCompetitors(updatedCompetitors)) {
            editCompetitors(competitionId, updatedCompetitors);
        }
    }

    @autobind
    private _onCanceling() {
        this.props.closeControl();
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCompetitors);
