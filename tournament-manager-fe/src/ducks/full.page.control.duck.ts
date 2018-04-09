import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { FullPageControlTypeEnum } from '../common/enums';
import { MainDuck } from './main.duck';

// action types
const actionTypes = {

};

// action creators
const actionCreators = {

};

// reducer
export interface IFullPageControlState {
    selectedControl: FullPageControlTypeEnum;
}

const initialState: IFullPageControlState = {
    selectedControl: FullPageControlTypeEnum.None
};

const reducer = (state= initialState, action: IAction): IFullPageControlState => {
    switch (action.type) {
        case MainDuck.actionTypes.OPEN_FULL_PAGE_CONTROL:
            return {
                ...state,
                selectedControl: action.payload,
            };
        case MainDuck.actionTypes.CLOSE_FULL_PAGE_CONTROL:
            return {
                ...state,
                selectedControl: FullPageControlTypeEnum.None
            };
    }
    return state;
};

// selectors
const selectors = {

};

export const FullPageControlDuck = {
    actionTypes,
    actionCreators,
    reducer,
    selectors
};
