import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { actionUtils } from '../utils/fetcher';

// action types
const actionTypes = {
    SHOW_COMPETITION_MENU: '@main/SHOW_COMPETITION_MENU',
    HIDE_COMPETITION_MENU: '@main/HIDE_COMPETITION_MENU',
    TOGGLE_COMPETITION_MENU: '@main/TOGGLE_COMPETITION_MENU'
};

// action creators
const actionCreators = {
    showCompetitionMenu: () => ({ type: actionTypes.SHOW_COMPETITION_MENU }),
    hideCompetitionMenu: () => ({ type: actionTypes.HIDE_COMPETITION_MENU }),
    toggleCompetitionMenu: () => ({ type: actionTypes.TOGGLE_COMPETITION_MENU })
};

// reducer
export interface IMainState {
    isCompetitionVisible: boolean;
}

const initialState: IMainState = {
    isCompetitionVisible: false
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
