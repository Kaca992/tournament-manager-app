import * as React from 'react';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';
import { Menu, Icon, IconProps } from 'semantic-ui-react';

// import './mainMenu.scss';

export interface IMainMenuItemProps {
    name: string;
    text: string;
    icon?: IconProps;
}

export interface IMainMenuProps {
    isVisible: boolean;
    selectedMenuItem: string;
    menuItems: IMainMenuItemProps[];
    onMenuItemClick(itemName: string): void;
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
        const className = classNames({'selected-menu-item': menuItem.name === this.props.selectedMenuItem}); 

        return <Menu.Item className={className} name={menuItem.name} onClick={() => this.props.onMenuItemClick(menuItem.name)}>
            <Icon {...iconProps} />
            {menuItem.text}
        </Menu.Item>;
    }

    render() {
        const {
            isVisible,
            menuItems
        } = this.props;

        return <Menu width='thin' visible={isVisible} icon='labeled' inverted vertical className="app-left-category-menu">
            {
                menuItems.map(menuItem => {
                    return this._renderMenuItem(menuItem);
                })
            }
        </Menu>;
    }
}
