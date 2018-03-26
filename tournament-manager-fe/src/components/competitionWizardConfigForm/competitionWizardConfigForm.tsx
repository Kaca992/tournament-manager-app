import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import './competitionWizardConfigForm.scss';
import { Tab, Dropdown, Input, Label, Header, InputOnChangeData, DropdownProps } from 'semantic-ui-react';
import { ICategory, ICompetitionConfigOptions } from '../../common/dataStructures';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import createInputWrapper from '../inputWrapper/inputWrapper';

export interface ICompetitionWizardConfigFormProps {
    competitionConfig: ICompetitionConfigOptions;
    categories: ICategory[];

    competitionErrorMessage?: string;
    categoriesErrorMessage?: string;

    onCompetitionConfigChanged(newConfig: ICompetitionConfigOptions);
}

export interface ICompetitionWizardConfigFormState {
    activeTabIndex: number;
}

export default class CompetitionWizardConfigForm extends React.Component<ICompetitionWizardConfigFormProps, ICompetitionWizardConfigFormState> {
    private localizationStrings = LocalizationProvider.Strings.Wizards.CompetitionCreator.ConfigForm;
    private InputWrapped = createInputWrapper(Input);
    private DropdownWrapped = createInputWrapper(Dropdown);

    constructor(props: ICompetitionWizardConfigFormProps) {
        super(props);
        this.state = {
            activeTabIndex: 0
        };
    }

    public render() {
        const {
            competitionName
        } = this.props.competitionConfig;
        const InputWrapped = this.InputWrapped;
        return (
            <div className='config-form_container'>
                {this._renderCategoryTabs()}
                <InputWrapped
                    title={this.localizationStrings.competitionNameHeaderText}
                    fluid
                    value={competitionName}
                    placeholder={this.localizationStrings.competitionNameNullText}
                    onChange={this._onCompetitionNameChanged}
                />
            </div>
        );
    }

    @autobind
    private _onCompetitionNameChanged(event: React.SyntheticEvent<HTMLInputElement>, data: InputOnChangeData) {
        event.preventDefault();
        const {
            onCompetitionConfigChanged,
            competitionConfig
        } = this.props;

        onCompetitionConfigChanged({...competitionConfig, competitionName: data.value});
    }

    @autobind
    private _onCompetitionCategoryNewChanged(event: React.SyntheticEvent<HTMLInputElement>, data: InputOnChangeData) {
        event.preventDefault();
        const {
            onCompetitionConfigChanged,
            competitionConfig
        } = this.props;

        const {
            activeTabIndex
        } = this.state;

        const categoryOptions = {
            categoryName: data.value,
            createNewCategory: true
        };

        onCompetitionConfigChanged({...competitionConfig, ...categoryOptions});
    }

    @autobind
    private _onCompetitionCategoryChanged(event: React.SyntheticEvent<HTMLInputElement>, data: DropdownProps) {
        event.preventDefault();
        const {
            onCompetitionConfigChanged,
            competitionConfig
        } = this.props;

        const {
            activeTabIndex
        } = this.state;

        const categoryOptions = {
            createNewCategory: false,
            categoryId: data.value as number
        };

        onCompetitionConfigChanged({...competitionConfig, ...categoryOptions});
    }

    @autobind
    private _onTabChanged() {
        const {
            activeTabIndex
        } = this.state;
        this.setState({
            activeTabIndex: (activeTabIndex + 1) % 2
        });
    }

    @autobind
    private _renderCategoryTabs() {
        const {
            categoryName
        } = this.props.competitionConfig;

        if (!this.props.categories) {
            return this._renderNewCategory(this.localizationStrings.categoryHeaderText);
        }

        const panes = [
            { menuItem: this.localizationStrings.categoryDropdownTab, render: this._renderExistingCategories },
            { menuItem: this.localizationStrings.newCategoryTab, render: this._renderNewCategory }
        ];

        return <div className='input-field_container'>
            <Tab activeIndex={this.state.activeTabIndex} onTabChange={this._onTabChanged} menu={{ secondary: true, pointing: true }} panes={panes} />
        </div>;
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
        const InputWrapped = this.InputWrapped;
        return <InputWrapped
            value={competitionConfig.categoryName}
            errorMessage={categoriesErrorMessage}
            fluid
            placeholder={this.localizationStrings.newCategoryNullText}
            onChange={this._onCompetitionCategoryNewChanged}
        />;
    }
}
