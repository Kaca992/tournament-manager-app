import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';

import './competitionCreatorWizard.scss';
import Wizard from '../../components/wizard/wizard';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import CompetitionWizardConfigForm from '../../components/competitionWizardConfigForm/competitionWizardConfigForm';
import { ICategory, ICompetitionCreationInfo, ICompetitionConfigOptions } from '../../common/dataStructures';

export interface ICompetitionCreatorWizardOwnProps {

}

export interface ICompetitionCreatorWizardProps extends ICompetitionCreatorWizardOwnProps {
    categories: ICategory[];
}

export interface ICompetitionCreatorWizardState {
    competitionCreationInfo: ICompetitionCreationInfo;
}

function mapStateToProps(state: IStore, ownProps: ICompetitionCreatorWizardOwnProps): Partial<ICompetitionCreatorWizardProps> {
    return {
        categories: state.competitionStructure.categories
    };
}

function mapDispatchToProps(dispatch: any): Partial<ICompetitionCreatorWizardProps> {
    return {

    };
}

class CompetitionCreatorWizard extends React.Component<ICompetitionCreatorWizardProps, ICompetitionCreatorWizardState> {
    private wizardStrings = LocalizationProvider.Strings.Wizards.CompetitionCreator;
    private wizardProps = {
        wizardTitle: this.wizardStrings.wizardTitle,
        wizardDescription: this.wizardStrings.wizardDescription,
        finishButtonText: this.wizardStrings.finishButtonText,

        wizardSteps: [{
            title: this.wizardStrings.configurationTitle,
            description: this.wizardStrings.configurationDescription
        },
        {
            title: this.wizardStrings.playersTitle,
            description: this.wizardStrings.playersDescription
        },
        {
            title: this.wizardStrings.formatTitle,
            description: this.wizardStrings.formatDescription
        }
        ]
    };

    constructor(props: ICompetitionCreatorWizardProps) {
        super(props);
        this.state = {
            competitionCreationInfo: {
                options: {}
            }
        };
    }

    public render() {
        return (
            <Wizard
                    {...this.wizardProps}
                    stepWidths={3}
                    renderWizardContent={this._renderWizardContent}
                    onWizardFinish={this._onWizardFinish}
            />
        );
    }

    @autobind
    private _renderWizardContent(stepIndex: number) {
        switch (stepIndex) {
            case 0:
                return this._renderConfigurationPage();
            case 1:
                return this._renderPlayerPage();
            case 2:
                return this._renderFormatPage();
        }

        throw new Error("Undefined wizard page");
    }

    @autobind
    private _renderConfigurationPage() {
        const {
            categories
        } = this.props;

        const {
            competitionCreationInfo
        } = this.state;

        return <CompetitionWizardConfigForm
            competitionConfig={competitionCreationInfo.options}
            categories={categories}
            onCompetitionConfigChanged={this._onCompetitionConfigChanged}
        />;
    }

    @autobind
    private _renderPlayerPage() {
        return <div>
            Hello 2;
        </div>;
    }

    @autobind
    private _renderFormatPage() {
        return <div>
            Hello 3;
        </div>;
    }

    @autobind
    private _onCompetitionConfigChanged(newConfig: ICompetitionConfigOptions) {
        const {
            competitionCreationInfo
        } = this.state;

        this.setState({
            competitionCreationInfo: {...competitionCreationInfo, options: newConfig}
        });
    }

    @autobind
    private _onWizardFinish() {
        console.log('Wizard Finished');
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionCreatorWizard);
