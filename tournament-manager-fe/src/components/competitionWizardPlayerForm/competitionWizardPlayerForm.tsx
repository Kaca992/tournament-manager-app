import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './competitionWizardPlayerForm.scss';
import { Grid, Header, Divider, Input, InputOnChangeData, Button, Icon } from 'semantic-ui-react';
import createInputWrapper from '../inputWrapper/inputWrapper';
import { ICompetitiorInfo } from '../../common/dataStructures';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';

export interface ICompetitionWizardPlayerFormProps {
    competitors: ICompetitiorInfo[];

    onCompetitorInfoChanged(newCompetitorInfo: ICompetitiorInfo);
}

export interface ICompetitionWizardPlayerFormState {

}

export default class CompetitionWizardPlayerForm extends React.Component<ICompetitionWizardPlayerFormProps, ICompetitionWizardPlayerFormState> {
    private competitorId: number;
    private InputWrapped = createInputWrapper(Input);
    private localizationStrings = LocalizationProvider.Strings.Wizards.CompetitionCreator.PlayerForm;

    constructor(props: ICompetitionWizardPlayerFormProps) {
        super(props);

        this.competitorId = props.competitors.length;
    }

    @autobind
    private _onNewCompetitorClicked() {
        this.props.onCompetitorInfoChanged({
            id: this.competitorId
        });

        this.competitorId = this.competitorId + 1;
    }

    public render() {
        const InputWrapped = this.InputWrapped;
        return (
            <div className='player-form_container'>
                <Header as='h2'>{this.localizationStrings.titleText}</Header>
                <Grid container columns={3} stackable textAlign='center' className='player-selection_grid'>
                    {this._renderHeaderRow()}
                    {
                        this.props.competitors.map(competitor => {
                            return this._renderCompetitorRow(competitor);
                        })
                    }
                    <Grid.Row>
                        <Grid.Column />
                        <Grid.Column />
                        <Grid.Column >
                            <Button primary onClick={this._onNewCompetitorClicked}>
                                <Icon name='add' />
                                {this.localizationStrings.addNewCompetitor}
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }

    @autobind
    private _renderHeaderRow() {
        return <Grid.Row>
            <Grid.Column as='h3'>{this.localizationStrings.playerNameHeader}</Grid.Column>
            <Grid.Column as='h3'>{this.localizationStrings.teamHeader}</Grid.Column>
            <Grid.Column as='h3'>{this.localizationStrings.rankingHeader}</Grid.Column>
        </Grid.Row>;
    }

    @autobind
    private _renderCompetitorRow(competitorInfo: ICompetitiorInfo) {
        const InputWrapped = this.InputWrapped;
        return <Grid.Row key={competitorInfo.id} className='player_input-row'>
            <Grid.Column>
                <InputWrapped
                    fluid
                    value={competitorInfo.name}
                    onChange={(event: React.SyntheticEvent<HTMLInputElement>, data: InputOnChangeData) => this.props.onCompetitorInfoChanged({ ...competitorInfo, name: data.value })}
                    errorMessage={competitorInfo.errorMessage}
                />
            </Grid.Column>
            <Grid.Column>
                <InputWrapped
                    fluid
                    value={competitorInfo.team}
                    onChange={(event: React.SyntheticEvent<HTMLInputElement>, data: InputOnChangeData) => this.props.onCompetitorInfoChanged({ ...competitorInfo, team: data.value })}
                />
            </Grid.Column>
            <Grid.Column>
                <InputWrapped
                    fluid
                    value={competitorInfo.ranking}
                    type='number'
                    onChange={(event: React.SyntheticEvent<HTMLInputElement>, data: InputOnChangeData) => this.props.onCompetitorInfoChanged({ ...competitorInfo, ranking: parseInt(data.value, 10) })}
                />
            </Grid.Column>
        </Grid.Row>;
    }
}
