import { ICompetitorCreationInfo } from '@data_structures/competitionCreation';
import { LocalizationProvider } from '@localization_provider';
import { autobind } from 'core-decorators';
import * as React from 'react';
import { Button, Grid, Header, Icon, Input, InputOnChangeData } from 'semantic-ui-react';
import './competitionWizardPlayerForm.scss';
import CustomInput from '../customInput/customInput';

export interface ICompetitionWizardPlayerFormProps {
    competitors: ICompetitorCreationInfo[];

    onCompetitorInfoChanged(newCompetitorInfo: ICompetitorCreationInfo);
    onCompetitorRemoved(competitorId: number);
}

export interface ICompetitionWizardPlayerFormState {

}

export default class CompetitionWizardPlayerForm extends React.Component<ICompetitionWizardPlayerFormProps, ICompetitionWizardPlayerFormState> {
    private competitorId: number;
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
                            <div className='add-button_container'>
                                <Button primary onClick={this._onNewCompetitorClicked}>
                                    <Icon name='add' />
                                    {this.localizationStrings.addNewCompetitor}
                                </Button>
                            </div>
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
    private _renderCompetitorRow(competitorInfo: ICompetitorCreationInfo) {
        return <Grid.Row key={competitorInfo.id} className='player_input-row'>
            <Grid.Column>
                <CustomInput
                    value={competitorInfo.name}
                    onChange={(value) => this.props.onCompetitorInfoChanged({ ...competitorInfo, name: value })}
                    errorMessage={competitorInfo.errorMessage}
                />
            </Grid.Column>
            <Grid.Column>
                <CustomInput
                    value={competitorInfo.team}
                    onChange={(value) => this.props.onCompetitorInfoChanged({ ...competitorInfo, team: value })}
                />
            </Grid.Column>
            <Grid.Column>
                <CustomInput
                    containerClassName='player_input-last-column-input'
                    value={competitorInfo.ranking}
                    type='number'
                    onChange={(value) => this.props.onCompetitorInfoChanged({ ...competitorInfo, ranking: parseInt(value, 10) })}
                />
                <Icon name='remove' size='large' className='delete-icon' onClick={() => this.props.onCompetitorRemoved(competitorInfo.id)} />
            </Grid.Column>
        </Grid.Row>;
    }
}
