import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './competitionWizardPlayerForm.scss';
import { Grid, Header, Divider, Input } from 'semantic-ui-react';
import createInputWrapper from '../inputWrapper/inputWrapper';

export interface ICompetitionWizardPlayerFormProps {

}

export interface ICompetitionWizardPlayerFormState {

}

export default class CompetitionWizardPlayerForm extends React.Component<ICompetitionWizardPlayerFormProps, ICompetitionWizardPlayerFormState> {
    private InputWrapped = createInputWrapper(Input);
    constructor(props: ICompetitionWizardPlayerFormProps) {
        super(props);

    }

    render() {
        const InputWrapped = this.InputWrapped;
        return (
            <div className='player-form_container'>
                <Header as='h2'>Specifying Device Visibility</Header>
                <Grid container columns={3} stackable textAlign='center' className='player-selection_grid'>
                    <Grid.Row>
                        <Grid.Column as='h3'>Ime</Grid.Column>
                        <Grid.Column as='h3'>Klub</Grid.Column>
                        <Grid.Column as='h3'>Ranking</Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <InputWrapped
                                fluid
                            />
                        </Grid.Column>
                        <Grid.Column>
                            <InputWrapped fluid />
                        </Grid.Column>
                        <Grid.Column>
                            <InputWrapped fluid />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column />
                        <Grid.Column />
                        <Grid.Column as='h3'>Ranking</Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}
