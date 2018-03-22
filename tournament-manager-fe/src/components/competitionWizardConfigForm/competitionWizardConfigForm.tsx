import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './competitionWizardConfigForm.scss';
import { Tab, Dropdown, Input, Label, Header } from 'semantic-ui-react';
import { ICategory, ICompetitionConfigOptions } from '../../common/dataStructures';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';

export interface ICompetitionWizardConfigFormProps {
    competitionConfig: ICompetitionConfigOptions;
    categories: ICategory[];
}

export interface ICompetitionWizardConfigFormState {

}

export default class CompetitionWizardConfigForm extends React.Component<ICompetitionWizardConfigFormProps, ICompetitionWizardConfigFormState> {
    private localizationStrings = LocalizationProvider.Strings.Wizards.CompetitionCreator.ConfigForm;

    constructor(props: ICompetitionWizardConfigFormProps) {
        super(props);

    }

    public render() {
        return (
            <div className='config-form_container'>
                {this._renderCategoryTabs()}
                <div className='input-field_container'>
                    <Header size='small'>{this.localizationStrings.categoryHeader}</Header>
                    <Input
                        fluid
                        value="testis"
                        placeholder={this.localizationStrings.newCategoryNullText}
                    />
                    <Label color='red' pointing>Please enter a value</Label>
                </div>
            </div>
        );
    }

    @autobind
    private _renderCategoryTabs() {
        const panes = [
            { menuItem: this.localizationStrings.categoryDropdownTab, render: this._renderExistingCategories },
            { menuItem: this.localizationStrings.newCategoryTab, render: this._renderNewCategory }
        ];

        return <div className='input-field_container'>
            <Header size='small'>{this.localizationStrings.categoryHeader}</Header>
            <Tab activeIndex={0} menu={{ secondary: true, pointing: true }} panes={panes} />
        </div>;
    }

    @autobind
    private _renderExistingCategories() {
        const {
            categories
        } = this.props;

        const categoryOptions = categories.map(category => {
            return {
                key: category.id,
                value: category.id,
                text: category.name
            };
        });

        return <div>
            <Dropdown
                className='input-field'
                placeholder={this.localizationStrings.categoryDropdownNullText}
                fluid
                selection
                options={categoryOptions}
            />
            <Label color='red' pointing>Please enter a value</Label>
        </div>;
    }

    @autobind
    private _renderNewCategory() {
        return <div>
            <Input
                fluid
                placeholder={this.localizationStrings.newCategoryNullText}
            />
            {/* <Label color='red' pointing>Please enter a value</Label> */}
        </div>;
    }
}
