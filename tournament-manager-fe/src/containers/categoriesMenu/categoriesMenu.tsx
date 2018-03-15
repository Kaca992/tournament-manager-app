import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';
import { Menu, Icon, IconProps } from 'semantic-ui-react';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';
import { IStore } from '../../store';
import { CategoryDuck } from '../../ducks/categories.duck';

export interface ICategoryMenuItemProps {
    id: number;
    name: string;
    icon?: IconProps;
}

export interface ICategoriesMenuContainerProps {
    selectedCategoryId: number;
    categories: ICategoryMenuItemProps[];
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
    private defaultIcon: IconProps = {
        name: 'trophy'
    };

    constructor(props: ICategoriesMenuContainerProps) {
        super(props);

    }

    @autobind
    _renderMenuItem(menuItem: ICategoryMenuItemProps) {
        const iconProps = menuItem.icon ? menuItem.icon : this.defaultIcon;
        const className = classNames({ 'selected-menu-item': menuItem.id === this.props.selectedCategoryId});

        return <Menu.Item key={menuItem.id} className={className} name={menuItem.id.toString()} onClick={() => this.props.onCategoryItemClick(menuItem.id)}>
            <Icon {...iconProps} />
            {menuItem.name}
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
                    {LocalizationProvider.Strings.addNewButtonText}
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
