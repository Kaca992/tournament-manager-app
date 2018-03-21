import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { NavigationTypeEnum } from '../common/enums';

// action types
const actionTypes = {

};

// action creators
const actionCreators = {

};

// reducer
export interface INavigationState {
    selectedNavigationType: NavigationTypeEnum;
}

const initialState: INavigationState = {
    selectedNavigationType: NavigationTypeEnum.Competitions
};

const reducer = (state= initialState, action: IAction): INavigationState => {
    switch (action.type) {

    }
    return state;
};

// selectors
const selectors = {

};

export const NavigationDuck = {
    actionTypes,
    actionCreators,
    reducer,
    selectors
};
