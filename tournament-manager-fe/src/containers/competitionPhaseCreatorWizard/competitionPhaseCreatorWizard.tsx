import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';

import './competitionCreatorWizard.scss';
import Wizard, { WizardDirectionEnum } from '../../components/wizard/wizard';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import TableCompetitorSelector from '../../components/tableCompetitorSelector/tableCompetitorSelector';
import CompetitorAllocatorFactory from '../../utils/competitionGenerator/competitorAllocator/competitorAllocatorFactory';
import { CompetitorAllocatorEnum } from '../../utils/competitionGenerator/competitorAllocator/competitorAllocator';
import { CompetitionPhaseTypeEnum, ScheduleTypeEnum, MatchInfoTypeEnum, CompetititorInfoTypeEnum, DialogTypeEnum } from '../../common/enums';
import { CompetitionDuck } from '../../ducks/competition.duck';
import { MainDuck } from '../../ducks/main.duck';
import { DialogDuck } from '../../ducks/dialog.duck';
import { ICompetitorInfo } from '../../common/dataStructures/competition';
import { ICompetitionCreationInfo, ICompetitionPhaseCreationInfo } from '../../common/dataStructures/competitionCreation';

export interface ICompetitionPhaseCreatorWizardProps {
    competitionId: number;
    competitors: ICompetitorInfo[];

    createNewCompetitionPhase(competitionId: number, competitionPhaseCreationInfo: ICompetitionPhaseCreationInfo): Promise<any>;
    closeControl();
}

export interface ICompetitionPhaseCreatorWizardState {
    competitionCreationInfo: ICompetitionPhaseCreationInfo;
}

function mapStateToProps(state: IStore): Partial<ICompetitionPhaseCreatorWizardProps> {
    return {
        competitionId: state.competitionStructure.selectedCompetitionId,
        competitors: state.competitions.competitors ? state.competitions.competitors.competitors : []
    };
}

function mapDispatchToProps(dispatch: any): Partial<ICompetitionPhaseCreatorWizardProps> {
    return {
        createNewCompetitionPhase: (competitionId: number, competitionPhaseCreationInfo: ICompetitionPhaseCreationInfo) => dispatch(CompetitionDuck.actionCreators.createCompetitionPhase(competitionId, competitionPhaseCreationInfo)),
        closeControl: () => dispatch(MainDuck.actionCreators.closeFullPageControl())
    };
}

class CompetitionPhaseCreatorWizard extends React.Component<ICompetitionPhaseCreatorWizardProps, ICompetitionPhaseCreatorWizardState> {
    private wizardStrings = LocalizationProvider.Strings.TableCompetitonSelector;
    private wizardProps = {
        wizardTitle: this.wizardStrings.title,
        wizardDescription: this.wizardStrings.description,
        finishButtonText: this.wizardStrings.generateButton,
        hideSteps: true,

        wizardSteps: [{
            title: this.wizardStrings.title,
            description: this.wizardStrings.description
        }]
    };

    constructor(props: ICompetitionPhaseCreatorWizardProps) {
        super(props);
        this.state = {
            competitionCreationInfo: {
                advancedOptions: {
                    competitionPhaseType: CompetitionPhaseTypeEnum.Table,
                    competitionAllocatorType: CompetitorAllocatorEnum.SnakeTableAllocator,
                    scheduleType: ScheduleTypeEnum.RoundRobinScheduleEnum,
                    matchInfoType: MatchInfoTypeEnum.TableTennisTournament,
                    competititorInfoType: CompetititorInfoTypeEnum.TableTennisTournament
                }
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
                    onCanceling={this._onCanceling}
            />
        );
    }

    @autobind
    private _renderWizardContent(stepIndex: number) {
        switch (stepIndex) {
            case 0:
                return this._renderFormatPage();
        }

        throw new Error("Undefined wizard page");
    }

    @autobind
    private _renderFormatPage() {
        const {
            competitorsAllocation
        } = this.state.competitionCreationInfo;

        return <TableCompetitorSelector
            competitors={this.props.competitors}
            competitorsAllocation={competitorsAllocation}
            onCompetitorsAllocationChanged={this._onCompetitorsAllocationChanged}
        />;
    }

    @autobind
    private _allocateCompetitors() {
        const {
            competitionCreationInfo
        } = this.state;

        const {
            advancedOptions
        } = this.state.competitionCreationInfo;

        if (!advancedOptions) {
            return;
        }

        const competitonAllocator = CompetitorAllocatorFactory.GetCompetitorAllocator(advancedOptions.competitionAllocatorType);
        const competitorsAllocation = competitonAllocator.generateAllocation(this.props.competitors);

        this.setState({
            competitionCreationInfo: {
                ...competitionCreationInfo,
                competitorsAllocation
            },
        });
    }

    @autobind
    private _onCompetitorsAllocationChanged(newCompetitorsAllocation: any) {
        const {
            competitionCreationInfo
        } = this.state;
        this.setState({
            competitionCreationInfo: {
                ...competitionCreationInfo,
                competitorsAllocation: newCompetitorsAllocation
            }
        });
    }

    @autobind
    private _onWizardFinish() {
        const { competitionId, createNewCompetitionPhase } = this.props;
        createNewCompetitionPhase(competitionId, this.state.competitionCreationInfo);
    }

    @autobind
    private _onCanceling() {
        this.props.closeControl();
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionPhaseCreatorWizard);
