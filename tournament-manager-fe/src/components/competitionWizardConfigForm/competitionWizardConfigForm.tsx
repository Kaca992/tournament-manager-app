import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './competitionWizardConfigForm.scss';
import { Tab, Dropdown, Input, Label, Header, InputOnChangeData, DropdownProps } from 'semantic-ui-react';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import createInputWrapper from '../inputWrapper/inputWrapper';
import { ICompetitionConfigOptions } from '../../common/dataStructures/competitionCreation';
import { ICategory } from '../../common/dataStructures/common';
import CustomInput from '../customInput/customInput';

export interface ICompetitionWizardConfigFormProps {
    competitionConfig: ICompetitionConfigOptions;
    categories: ICategory[];

    competitionErrorMessage?: string;
    categoriesErrorMessage?: string;

    onCompetitionConfigChanged(newConfig: ICompetitionConfigOptions);
}

export interface ICompetitionWizardConfigFormState {

}

export default class CompetitionWizardConfigForm extends React.Component<ICompetitionWizardConfigFormProps, ICompetitionWizardConfigFormState> {
    private localizationStrings = LocalizationProvider.Strings.Wizards.CompetitionCreator.ConfigForm;
    private DropdownWrapped = createInputWrapper(Dropdown);

    constructor(props: ICompetitionWizardConfigFormProps) {
        super(props);
    }

    public render() {
        const {
            competitionName
        } = this.props.competitionConfig;
        return (
            <div className='config-form_container'>
                {this._renderCategoryTabs()}
                <CustomInput
                    title={this.localizationStrings.competitionNameHeaderText}
                    value={competitionName}
                    placeholder={this.localizationStrings.competitionNameNullText}
                    onChange={this._onCompetitionNameChanged}
                    errorMessage={this.props.competitionErrorMessage}
                />
            </div>
        );
    }

    @autobind
    private _renderCategoryTabs() {
        const {
            createNewCategory
        } = this.props.competitionConfig;

        if (!this.props.categories || this.props.categories.length === 0) {
            return this._renderNewCategory(this.localizationStrings.categoryHeaderText);
        }

        const panes = [
            { menuItem: this.localizationStrings.categoryDropdownTab, render: this._renderExistingCategories },
            { menuItem: this.localizationStrings.newCategoryTab, render: this._renderNewCategory }
        ];

        return <div className='input-field_container'>
            <Tab activeIndex={createNewCategory ? 1 : 0} onTabChange={this._onTabChanged} menu={{ secondary: true, pointing: true }} panes={panes} />
        </div>;
    }

    @autobind
    private _onCompetitionNameChanged(value: any) {
        const {
            onCompetitionConfigChanged,
            competitionConfig
        } = this.props;

        onCompetitionConfigChanged({ ...competitionConfig, competitionName: value });
    }

    @autobind
    private _onCompetitionCategoryNewChanged(value) {
        const {
            onCompetitionConfigChanged,
            competitionConfig
        } = this.props;

        const categoryOptions = {
            categoryName: value
        };

        onCompetitionConfigChanged({ ...competitionConfig, ...categoryOptions });
    }

    @autobind
    private _onCompetitionCategoryChanged(event: React.SyntheticEvent<HTMLInputElement>, data: DropdownProps) {
        event.preventDefault();
        const {
            onCompetitionConfigChanged,
            competitionConfig
        } = this.props;

        const categoryOptions = {
            categoryId: data.value as number
        };

        onCompetitionConfigChanged({ ...competitionConfig, ...categoryOptions });
    }

    @autobind
    private _onTabChanged() {
        const {
            onCompetitionConfigChanged,
            competitionConfig
        } = this.props;

        onCompetitionConfigChanged({ ...competitionConfig, createNewCategory: !competitionConfig.createNewCategory });
    }

    @autobind
    private _renderExistingCategories() {
        const {
            categories,
            competitionConfig,
            categoriesErrorMessage
        } = this.props;

        const categoryOptions = categories.map(category => {
            return {
                key: category.id,
                value: category.id,
                text: category.name,
            };
        });

        const DropdownWrapped = this.DropdownWrapped;
        return <DropdownWrapped
            title="Kategorija"
            placeholder={this.localizationStrings.categoryDropdownNullText}
            fluid
            selection
            errorMessage={categoriesErrorMessage}
            options={categoryOptions}
            value={competitionConfig.categoryId}
            onChange={this._onCompetitionCategoryChanged}
        />;
    }

    @autobind
    private _renderNewCategory(title?: string) {
        const {
            competitionConfig,
            categoriesErrorMessage
        } = this.props;
        return <CustomInput
            title="Kategorija"
            value={competitionConfig.categoryName}
            errorMessage={categoriesErrorMessage}
            placeholder={this.localizationStrings.newCategoryNullText}
            onChange={this._onCompetitionCategoryNewChanged}
            className={"config-form_container__new-category__input"}
        />;
    }
}
