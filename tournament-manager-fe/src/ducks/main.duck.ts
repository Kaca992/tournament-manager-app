import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { actionUtils } from '../utils/fetcher';
import { ControlTypeEnum } from '../common/enums';

// action types
const actionTypes = {
    SHOW_COMPETITION_MENU: '@main/SHOW_COMPETITION_MENU',
    HIDE_COMPETITION_MENU: '@main/HIDE_COMPETITION_MENU',
    TOGGLE_COMPETITION_MENU: '@main/TOGGLE_COMPETITION_MENU',

    OPEN_COMPETITION_WIZARD: '@main/OPEN_COMPETITION_WIZARD',
    CLOSE_COMPETITION_WIZARD: '@main/CLOSE_COMPETITION_WIZARD'
};

// action creators
const actionCreators = {
    showCompetitionMenu: () => ({ type: actionTypes.SHOW_COMPETITION_MENU }),
    hideCompetitionMenu: () => ({ type: actionTypes.HIDE_COMPETITION_MENU }),
    toggleCompetitionMenu: () => ({ type: actionTypes.TOGGLE_COMPETITION_MENU }),

    openCompetitionWizard: () => ({ type: actionTypes.OPEN_COMPETITION_WIZARD }),
    closeCompetitionWizard: () => ({ type: actionTypes.CLOSE_COMPETITION_WIZARD })
};

// reducer
export interface IMainState {
    selectedControl: ControlTypeEnum;
    isCompetitionVisible: boolean;
}

const initialState: IMainState = {
    selectedControl: ControlTypeEnum.CompetitionWizard,
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
        case actionTypes.OPEN_COMPETITION_WIZARD:
            return {
                ...state, selectedControl: ControlTypeEnum.CompetitionWizard
            };
        case actionTypes.CLOSE_COMPETITION_WIZARD:
            return {
                ...state, selectedControl: ControlTypeEnum.Main
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
