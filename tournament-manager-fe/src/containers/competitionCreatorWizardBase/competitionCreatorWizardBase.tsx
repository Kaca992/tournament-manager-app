import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';

import Wizard, { WizardDirectionEnum } from '../../components/wizard/wizard';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import CompetitionWizardConfigForm from '../../components/competitionWizardConfigForm/competitionWizardConfigForm';
import { ICompetitionCreationInfo, ICompetitionConfigOptions, ICompetitorCreationInfo } from '../../common/dataStructures/competitionCreation';
import { validateEmptyString, validateEmptyValue } from '../../utils/validation';
import CompetitionWizardPlayerForm from '../../components/competitionWizardPlayerForm/competitionWizardPlayerForm';
import TableCompetitorSelector from '../../components/tableCompetitorSelector/tableCompetitorSelector';
import CompetitorAllocatorFactory from '../../utils/competitionGenerator/competitorAllocator/competitorAllocatorFactory';
import { CompetitorAllocatorEnum } from '../../utils/competitionGenerator/competitorAllocator/competitorAllocator';
import { CompetitionPhaseTypeEnum, ScheduleTypeEnum, DialogTypeEnum } from '../../common/enums';
import { generateTestPlayerData } from '../../mock/competitionWizardMock';
import { ICategory } from '../../common/dataStructures/common';
import { CompetitionDuck } from '../../ducks/competition.duck';
import { MainDuck } from '../../ducks/main.duck';
import { DialogDuck } from '../../ducks/dialog.duck';

export interface ICompetitionCreatorWizardOwnProps {

}

export interface ICompetitionCreatorWizardProps extends ICompetitionCreatorWizardOwnProps {
    categories: ICategory[];

    createNewCompetition(competitionSettings: ICompetitionCreationInfo): Promise<any>;
    openDialog(dialogType: DialogTypeEnum, dialogParams: any);
    closeDialog();
    closeWizard();
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
        createNewCompetition: (competitionSettings: ICompetitionCreationInfo) => dispatch(CompetitionDuck.actionCreators.createNewCompetitionBase(competitionSettings)),
        openDialog: (dialogType: DialogTypeEnum, dialogParams: any) => dispatch(DialogDuck.actionCreators.openDialog(dialogType, dialogParams)),
        closeDialog: () => dispatch(DialogDuck.actionCreators.closeDialog()),
        closeWizard: () => dispatch(MainDuck.actionCreators.closeFullPageControl())
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
        }
        ]
    };

    constructor(props: ICompetitionCreatorWizardProps) {
        super(props);
        this.state = {
            competitionCreationInfo: {
                competitionId: -1,
                options: {
                    createNewCategory: !props.categories
                },
                // competitors: [
                //     { id: 0 }
                // ]
                // TODO: testing purposes
                competitors: generateTestPlayerData(10)
            }
        };
    }

    public render() {
        return (
            <Wizard
                {...this.wizardProps}
                stepWidths={4}
                renderWizardContent={this._renderWizardContent}
                onWizardFinish={this._onWizardFinish}
                onPageLeaving={this._onPageLeaving}
                onCanceling={this._onCanceling}
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
            onCompetitorRemoved={this._onCompetitorRemoved}
        />;
    }
    @autobind
    private _onCompetitionConfigChanged(newConfig: ICompetitionConfigOptions) {
        const {
            competitionCreationInfo
        } = this.state;

        this._validateConfig({ ...competitionCreationInfo, options: newConfig });
    }

    @autobind
    private _onCompetitorInfoChanged(newCompetitorInfo: ICompetitorCreationInfo) {
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
    private _onCompetitorRemoved(competitorId: number) {
        const {
            competitionCreationInfo
        } = this.state;

        const competitors = competitionCreationInfo.competitors.filter(competitor => competitor.id !== competitorId);
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
            const isValid = this._validateCompetitors(this.state.competitionCreationInfo);
            return isValid;
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
        const { createNewCompetition } = this.props;
        createNewCompetition(this.state.competitionCreationInfo);
    }

    @autobind
    private _onCanceling() {
        this.props.closeWizard();
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionCreatorWizard);
