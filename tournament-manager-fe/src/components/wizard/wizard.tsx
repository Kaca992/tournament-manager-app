import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './wizard.scss';
import HeaderSubHeader, { Container, Step, Header, Icon, Button } from 'semantic-ui-react';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';

export enum WizardDirectionEnum {
    Back = -1,
    Next = 1
}

interface IWizardSteps {
    title: string;
    description?: string;
}

export interface IWizardProps {
    wizardTitle: string;
    wizardDescription?: string;
    wizardSteps: IWizardSteps[];
    stepWidths: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

    stepIndex?: number;

    renderWizardContent(stepIndex: number): JSX.Element;
    onPageLeaving?(currentStepIndex: number, direction: WizardDirectionEnum);
    onCanceling?();

    customFooterRenderer?(stepIndex?: number): JSX.Element;
}

export interface IWizardState {
    stepIndex: number;
}

export default class Wizard extends React.Component<IWizardProps, IWizardState> {
    constructor(props: IWizardProps) {
        super(props);

        this.state = {
            stepIndex: props.stepIndex ? props.stepIndex : 0
        };
    }

    public componentWillReceiveProps(nextProps: IWizardProps) {
        if (nextProps.stepIndex && this.state.stepIndex !== nextProps.stepIndex) {
            this.setState({ stepIndex: nextProps.stepIndex });
        }
    }

    public render() {
        return (
            <Container fluid className='wizard-container'>
                <div className='header-container'>
                    {this._renderHeader()}
                    {this._renderSteps()}
                </div>
                <div className='content-container'>
                    {this._renderWizardContent()}
                </div>
                {this._renderFooter()}
            </Container>
        );
    }

    @autobind
    private _renderWizardContent() {
        return this.props.renderWizardContent(this.state.stepIndex);
    }

    @autobind
    private _renderHeader() {
        const {
            wizardTitle,
            wizardDescription
        } = this.props;

        return <Header as='h2'>
            <Icon name='angle left' onClick={() => alert('Hello')} />
            <Header.Content>
                {wizardTitle}
                {wizardDescription && <Header.Subheader>{wizardDescription}</Header.Subheader>}
            </Header.Content>
        </Header>;
    }

    @autobind
    private _renderSteps() {
        const {
            wizardSteps,
            stepWidths
        } = this.props;

        const {
            stepIndex
        } = this.state;

        return <Step.Group ordered widths={stepWidths} className='steps-container'>
            {
                wizardSteps.map((wizardStep, index) => {
                    return <Step key={index} completed={index > stepIndex} active={index === stepIndex}>
                        <Step.Content>
                            <Step.Title>{wizardStep.title}</Step.Title>
                            {wizardStep.description && <Step.Description>{wizardStep.description}</Step.Description>}
                        </Step.Content>
                    </Step>;
                })
            }
        </Step.Group>;
    }

    @autobind
    private _renderFooter() {
        if (this.props.customFooterRenderer) {
            return this.props.customFooterRenderer(this.state.stepIndex);
        }

        const {
            backButtonText,
            cancelButtonText,
            nextButtonText
        } = LocalizationProvider.Strings.Wizards;

        return <div className='footer-container'>
            <Button className='link' content={cancelButtonText} onClick={this._onCanceling} />
            <Button disabled={this._backState} secondary content={backButtonText} icon='left arrow' labelPosition='left' onClick={() => this._onPageChanging(WizardDirectionEnum.Back)} />
            <Button disabled={this._nextState} primary content={nextButtonText} icon='right arrow' labelPosition='right' onClick={() => this._onPageChanging(WizardDirectionEnum.Next)} />
        </div>;
    }

    @autobind
    private get _backState(): boolean {
        if (this.state.stepIndex === 0) {
            return false;
        }

        return true;
    }
    @autobind
    private get _nextState(): boolean {
        return true;
    }

    @autobind
    private _onPageChanging(direction: WizardDirectionEnum) {
        const {
            onPageLeaving
        } = this.props;

        if (onPageLeaving && !onPageLeaving(this.state.stepIndex, direction)) {
            return;
        }

        this.setState((prevState) => {
            return {
                ...prevState,
                stepIndex: prevState.stepIndex + direction
            };
        });
    }

    @autobind
    private _onCanceling() {
        if (this.props.onCanceling) {
            this.props.onCanceling();
        }
    }
}
