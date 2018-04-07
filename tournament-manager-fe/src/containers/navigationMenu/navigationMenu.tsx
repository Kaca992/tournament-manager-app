import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';
import { autobind } from 'core-decorators';

import { IStore } from '../../store';
import { NavigationTypeEnum } from '../../common/enums';
import { INavigationMenuItem } from './navigation.props';
import { Menu, Icon } from 'semantic-ui-react';
import { LocalizationProvider } from '../../assets/localization/localizationProvider';

export interface INavigationMenuProps {
    selectedNavigationType: NavigationTypeEnum;
}

function mapStateToProps(state: IStore): Partial<INavigationMenuProps> {
    return {
        selectedNavigationType: state.navigation.selectedNavigationType
    };
}

function mapDispatchToProps(dispatch: any): Partial<INavigationMenuProps> {
    return {

    };
}

class NavigationMenu extends React.Component<INavigationMenuProps, {}> {
    private navigationItems: INavigationMenuItem[] = [
        { type: NavigationTypeEnum.Competitions, name: LocalizationProvider.Strings.Navigation.competition, icon: {name: 'trophy'}  }
    ];

    constructor(props: INavigationMenuProps) {
        super(props);

    }

    @autobind
    private _renderMenuItem(navigationItem: INavigationMenuItem) {
        const className = classNames({ 'selected-menu-item': navigationItem.type === this.props.selectedNavigationType });

        return <Menu.Item key={navigationItem.type} className={className} icon={navigationItem.icon} />;
    }

    public render() {
        return <Menu visible={true} icon vertical className="app-left-navigation-menu">
            {
                this.navigationItems.map(menuItem => {
                    return this._renderMenuItem(menuItem);
                })
            }
        </Menu>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationMenu);
