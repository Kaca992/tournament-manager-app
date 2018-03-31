import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';

import './competitionCreatorWizard.scss';
import Wizard, { WizardDirectionEnum } from '../../components/wizard/wizard';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import CompetitionWizardConfigForm from '../../components/competitionWizardConfigForm/competitionWizardConfigForm';
import { ICategory, ICompetitionCreationInfo, ICompetitionConfigOptions, ICompetitiorInfo } from '../../common/dataStructures';
import { validateEmptyString, validateEmptyValue } from '../../utils/validation';
import CompetitionWizardPlayerForm from '../../components/competitionWizardPlayerForm/competitionWizardPlayerForm';

export interface ICompetitionCreatorWizardOwnProps {

}

export interface ICompetitionCreatorWizardProps extends ICompetitionCreatorWizardOwnProps {
    categories: ICategory[];
}

export interface ICompetitionCreatorWizardState {
    competitionCreationInfo: ICompetitionCreationInfo;

    competitionErrorMessage?: string;
    categoriesErrorMessage?: string;
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
                options: {
                    createNewCategory: !props.categories
                },
                competitors: [
                    { id: 0 }
                ]
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
                    onPageLeaving={this._onPageLeaving}
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
            competitionCreationInfo,
            categoriesErrorMessage,
            competitionErrorMessage
        } = this.state;

        return <CompetitionWizardConfigForm
            competitionConfig={competitionCreationInfo.options}
            categories={categories}
            onCompetitionConfigChanged={this._onCompetitionConfigChanged}
            competitionErrorMessage={competitionErrorMessage}
            categoriesErrorMessage={categoriesErrorMessage}
        />;
    }

    @autobind
    private _renderPlayerPage() {
        const {
            competitors
        } = this.state.competitionCreationInfo;

        return <CompetitionWizardPlayerForm
            competitors={competitors}
            onCompetitorInfoChanged={this._onCompetitorInfoChanged}
        />;
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

        this._validateConfig({...competitionCreationInfo, options: newConfig});
    }

    @autobind
    private _onCompetitorInfoChanged(newCompetitorInfo: ICompetitiorInfo) {
        const {
            competitionCreationInfo
        } = this.state;

        let competitors = [...competitionCreationInfo.competitors];
        const oldCompetitorInfoIndex = competitionCreationInfo.competitors.findIndex(x => x.id === newCompetitorInfo.id);
        // existing
        if (oldCompetitorInfoIndex !== -1) {
            competitors[oldCompetitorInfoIndex] = newCompetitorInfo;
        } else {
            competitors.push(newCompetitorInfo);
        }

        this.setState({
            competitionCreationInfo: {
                ...competitionCreationInfo,
                competitors
            }
        });
    }

    @autobind
    private _onPageLeaving(currentStepIndex: number, direction: WizardDirectionEnum) {
        if (currentStepIndex === 0 && direction === WizardDirectionEnum.Next) {
            return this._validateConfig(this.state.competitionCreationInfo);
        }

        if (currentStepIndex === 1 && direction === WizardDirectionEnum.Next) {
            return this._validateCompetitors(this.state.competitionCreationInfo);
        }

        return true;
    }

    @autobind
    private _validateConfig(newInfo: ICompetitionCreationInfo): boolean {
        let isValid = true;

        const categoriesErrorMessage = newInfo.options.createNewCategory ? validateEmptyString(newInfo.options.categoryName) : validateEmptyValue(newInfo.options.categoryId);
        const competitionErrorMessage = validateEmptyString(newInfo.options.competitionName);

        this.setState({
            competitionCreationInfo: {
                ...newInfo
            },
            categoriesErrorMessage,
            competitionErrorMessage
        });

        isValid = !categoriesErrorMessage && !competitionErrorMessage;
        return isValid;
    }

    @autobind
    private _validateCompetitors(newInfo: ICompetitionCreationInfo): boolean {
        let areCompetitorsValid = true;
        const competitors = newInfo.competitors.map(competitor => {
            const competitorErrorMessage = validateEmptyString(competitor.name);
            areCompetitorsValid = areCompetitorsValid && !competitorErrorMessage;

            return {
                ...competitor,
                errorMessage: competitorErrorMessage
            };
        });

        this.setState({
            competitionCreationInfo: {
                ...newInfo,
                competitors
            }
        });

        return areCompetitorsValid;
    }

    @autobind
    private _onWizardFinish() {
        console.log('Wizard Finished');
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionCreatorWizard);