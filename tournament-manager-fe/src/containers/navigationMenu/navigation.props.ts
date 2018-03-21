import { NavigationTypeEnum } from "../../common/enums";
import { IconProps } from "semantic-ui-react";

export interface INavigationMenuItem {
    type: NavigationTypeEnum;
    name: string;
    icon: IconProps;
}
