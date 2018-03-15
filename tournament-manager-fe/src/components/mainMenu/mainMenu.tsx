import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';
import { Menu, Icon, IconProps } from 'semantic-ui-react';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';

// import './mainMenu.scss';

export interface IMainMenuItemProps {
    id: number;
    name: string;
    icon?: IconProps;
}

export interface IMainMenuProps {
    isVisible: boolean;
    selectedMenuItem: number;
    menuItems: IMainMenuItemProps[];
    onMenuItemClick(id: number): void;
    onAddNewCategoryItemClick(): void;
}

export default class MainMenu extends React.Component<IMainMenuProps, {}> {
    private defaultIcon: IconProps = {
        name: 'trophy'
    };

    constructor(props: IMainMenuProps) {
        super(props);

    }

    @autobind
    _renderMenuItem(menuItem: IMainMenuItemProps) {
        const iconProps = menuItem.icon ? menuItem.icon : this.defaultIcon;
        const className = classNames({ 'selected-menu-item': menuItem.id === this.props.selectedMenuItem });

        return <Menu.Item key={menuItem.id} className={className} name={menuItem.id.toString()} onClick={() => this.props.onMenuItemClick(menuItem.id)}>
            <Icon {...iconProps} />
            {menuItem.name}
        </Menu.Item>;
    }

    render() {
        const {
            isVisible,
            menuItems,
            onAddNewCategoryItemClick
        } = this.props;

        return <Menu width='thin' visible={isVisible} icon='labeled' vertical className="app-left-category-menu">
            <Menu.Item key='add-category' onClick={onAddNewCategoryItemClick}>
                    <Icon name="add" />
                    {LocalizationProvider.Strings.addNewButtonText}
            </Menu.Item>
            {
                menuItems.map(menuItem => {
                    return this._renderMenuItem(menuItem);
        })
    }
        </Menu>;
    }
}
