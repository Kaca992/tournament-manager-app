import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { actionUtils, ICustomFetchOptions, fetcher } from '../utils/fetcher';
import { ControlTypeEnum, FullPageControlTypeEnum, DialogTypeEnum } from '../common/enums';
import { ExportController } from '../constants/service.endpoints';
import { actionCreators as dialogActions } from './dialog.duck';

// action types
const actionTypes = {
    SHOW_COMPETITION_MENU: '@main/SHOW_COMPETITION_MENU',
    HIDE_COMPETITION_MENU: '@main/HIDE_COMPETITION_MENU',
    TOGGLE_COMPETITION_MENU: '@main/TOGGLE_COMPETITION_MENU',

    OPEN_FULL_PAGE_CONTROL: '@main/OPEN_FULL_PAGE_CONTROL',
    CLOSE_FULL_PAGE_CONTROL: '@main/CLOSE_FULL_PAGE_CONTROL',

    EXPORT: '@main/EXPORT'
};

// action creators
export const actionCreators = {
    showCompetitionMenu: () => ({ type: actionTypes.SHOW_COMPETITION_MENU }),
    hideCompetitionMenu: () => ({ type: actionTypes.HIDE_COMPETITION_MENU }),
    toggleCompetitionMenu: () => ({ type: actionTypes.TOGGLE_COMPETITION_MENU }),

    openFullPageControl: (controlType: FullPageControlTypeEnum) => ({ type: actionTypes.OPEN_FULL_PAGE_CONTROL, payload: controlType}),
    closeFullPageControl: () => ({ type: actionTypes.CLOSE_FULL_PAGE_CONTROL }),
    export(fileName: string) {
        return (dispatch, getState) => {
            let url = ExportController.export(fileName);
            let options: ICustomFetchOptions = {
                action: actionTypes.EXPORT,
                hasResult: false
            };

            dispatch(dialogActions.openDialog(DialogTypeEnum.LoadingInfo, "Generiranje Dokumentacije..."));
            return fetcher(url, options, dispatch, { method: 'GET' }).then((phaseId) => {
                dispatch(dialogActions.updateDialog({
                    acceptButtonText: 'OK'
                }, "Uspješno generirana dokumentacija."));
            }).catch(() => {
                dispatch(dialogActions.updateDialog({
                    acceptButtonText: 'OK'
                }, "Došlo je do pogreške prilikom generiranja dokumentacije."));
            });
        };
    }
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
