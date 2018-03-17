import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';
import { Menu, Icon, IconProps } from 'semantic-ui-react';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import { IStore } from '../../store';
import { CategoryDuck } from '../../ducks/categories.duck';
import { ICategory } from '../../common/dataStructures';

export interface ICategoriesMenuContainerProps {
    selectedCategoryId: number;
    categories: ICategory[];
    onCategoryItemClick(id: number): void;
    onAddNewCategoryItemClick?(): void;
}

export interface ICategoriesMenuContainerState {

}

function mapStateToProps(state: IStore): Partial<ICategoriesMenuContainerProps> {
    return {
        selectedCategoryId: state.categories.selectedCategoryId,
        categories: state.categories.categories
    };
}

function mapDispatchToProps(dispatch: any): Partial<ICategoriesMenuContainerProps> {
    return {
        onCategoryItemClick: (selectedCategoryId: number) => dispatch(CategoryDuck.actionCreators.selectCategory(selectedCategoryId))
    };
}

export class CategoriesMenuContainer extends React.Component<ICategoriesMenuContainerProps, ICategoriesMenuContainerState> {
    constructor(props: ICategoriesMenuContainerProps) {
        super(props);

    }

    @autobind
    _renderMenuItem(categoryItem: ICategory) {
        const className = classNames({ 'selected-menu-item': categoryItem.id === this.props.selectedCategoryId});

        return <Menu.Item key={categoryItem.id} className={className} name={categoryItem.id.toString()} onClick={() => this.props.onCategoryItemClick(categoryItem.id)}>
            <Icon name={categoryItem.iconName as any} />
            {categoryItem.name}
        </Menu.Item>;
    }

    render() {
        const {
            categories,
            onAddNewCategoryItemClick
        } = this.props;

        return <Menu width='thin' visible={true} icon='labeled' vertical className="app-left-category-menu">
            <Menu.Item key='add-category' onClick={onAddNewCategoryItemClick}>
                    <Icon name="add" />
                    {LocalizationProvider.Strings.addNewCategoryButtonText}
            </Menu.Item>
            {
                categories.map(menuItem => {
                    return this._renderMenuItem(menuItem);
        })
    }
        </Menu>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesMenuContainer);
