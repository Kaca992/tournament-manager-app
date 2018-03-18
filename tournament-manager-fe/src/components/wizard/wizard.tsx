import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './wizard.scss';
import { Container, Step, Header, Icon } from 'semantic-ui-react';

export interface IWizardProps {

}

export interface IWizardState {

}

export default class Wizard extends React.Component<IWizardProps, IWizardState> {
    constructor(props: IWizardProps) {
        super(props);

    }

    render() {
        return (
            <Container fluid className='wizard-container'>
                <div className='header-container'>
                    <Header as='h2'>
                        <Icon name='angle left' onClick={() => alert('Hello')}/>
                        <Header.Content>
                            Account Settings
                            <Header.Subheader>
                                Manage your preferences
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                    <Step.Group ordered widths={4} className='steps-container'>
                        <Step completed>
                            <Step.Content>
                                <Step.Title>Shipping</Step.Title>
                                <Step.Description>Choose your shipping options</Step.Description>
                            </Step.Content>
                        </Step>

                        <Step completed>
                            <Step.Content>
                                <Step.Title>Billing</Step.Title>
                                <Step.Description>Enter billing information</Step.Description>
                            </Step.Content>
                        </Step>

                        <Step active>
                            <Step.Content>
                                <Step.Title>Confirm Order</Step.Title>
                            </Step.Content>
                        </Step>

                        <Step>
                            <Step.Content>
                                <Step.Title>Finish</Step.Title>
                            </Step.Content>
                        </Step>
                    </Step.Group>
                </div>
                <div className='content-container'>
                    Content
                </div>
                <div className='footer-container'>
                    Footer
                </div>
            </Container>
        );
    }
}
