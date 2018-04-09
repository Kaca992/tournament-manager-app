import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { actionUtils } from '../utils/fetcher';
import { ControlTypeEnum, FullPageControlTypeEnum } from '../common/enums';

// action types
const actionTypes = {
    SHOW_COMPETITION_MENU: '@main/SHOW_COMPETITION_MENU',
    HIDE_COMPETITION_MENU: '@main/HIDE_COMPETITION_MENU',
    TOGGLE_COMPETITION_MENU: '@main/TOGGLE_COMPETITION_MENU',

    OPEN_FULL_PAGE_CONTROL: '@main/OPEN_FULL_PAGE_CONTROL',
    CLOSE_FULL_PAGE_CONTROL: '@main/CLOSE_FULL_PAGE_CONTROL'
};

// action creators
export const actionCreators = {
    showCompetitionMenu: () => ({ type: actionTypes.SHOW_COMPETITION_MENU }),
    hideCompetitionMenu: () => ({ type: actionTypes.HIDE_COMPETITION_MENU }),
    toggleCompetitionMenu: () => ({ type: actionTypes.TOGGLE_COMPETITION_MENU }),

    openFullPageControl: (controlType: FullPageControlTypeEnum) => ({ type: actionTypes.OPEN_FULL_PAGE_CONTROL, payload: controlType}),
    closeFullPageControl: () => ({ type: actionTypes.CLOSE_FULL_PAGE_CONTROL })
};

// reducer
export interface IMainState {
    selectedControl: ControlTypeEnum;
    previousControl: ControlTypeEnum;
    isCompetitionVisible: boolean;
}

const initialState: IMainState = {
    selectedControl: ControlTypeEnum.Main,
    previousControl: ControlTypeEnum.None,
    isCompetitionVisible: true
};

const reducer = (state = initialState, action: IAction): IMainState => {
    switch (action.type) {
        case actionTypes.SHOW_COMPETITION_MENU:
            return {
                ...state, isCompetitionVisible: true
            };
        case actionTypes.HIDE_COMPETITION_MENU:
            return {
                ...state, isCompetitionVisible: false
            };
        case actionTypes.TOGGLE_COMPETITION_MENU:
            return {
                ...state, isCompetitionVisible: !state.isCompetitionVisible
            };
        case actionTypes.OPEN_FULL_PAGE_CONTROL:
            const currentControl = state.selectedControl;
            return {
                ...state,
                selectedControl: ControlTypeEnum.FullPageControl,
                previousControl: currentControl
            };
        case actionTypes.CLOSE_FULL_PAGE_CONTROL:
            const previousControl = state.previousControl;
            return {
                ...state,
                selectedControl: previousControl,
                previousControl: ControlTypeEnum.None
            };
    }
    return state;
};

// selectors
const selectors = {

};

export const MainDuck = {
    actionTypes,
    actionCreators,
    reducer,
    selectors
};
