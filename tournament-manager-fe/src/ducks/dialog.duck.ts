import { createSelector } from 'reselect';
import { IAction, IDialogProps } from '../common/interfaces';
import { IStore } from '../store/index';
import { DialogTypeEnum } from '../common/enums';
import { DialogParamsType } from '../containers/dialogContainer/dialog.utils';

// action types
const actionTypes = {
    OPEN_DIALOG: '@main/OPEN_DIALOG',
    UPDATE_DIALOG: '@main/UPDATE_DIALOG',
    CLOSE_DIALOG: '@main/CLOSE_DIALOG'
};

// action creators
export const actionCreators = {
    openDialog(dialogType: DialogTypeEnum, dialogParams?: DialogParamsType, dialogProps?: IDialogProps, autoCloseOnAccept: boolean = true) {
        return (dispatch, getState) => {
            const state = getState() as IStore;

            // if (state.dialog.dialogType !== DialogTypeEnum.None) {
            //     return;
            // }

            dispatch({
                type: actionTypes.OPEN_DIALOG,
                payload: { dialogType, autoCloseOnAccept, dialogProps, dialogParams }
            });
        };
    },
    updateDialog: (dialogProps: Partial<IDialogProps>, dialogParams?: DialogParamsType, dialogType?: DialogTypeEnum) => ({ type: actionTypes.UPDATE_DIALOG, payload: { dialogProps, dialogParams, dialogType } }),
    closeDialog: () => ({ type: actionTypes.CLOSE_DIALOG })
};

// reducer
export interface IDialogState {
    dialogType: DialogTypeEnum;
    autoCloseOnAccept: boolean;
    dialogProps?: IDialogProps;
    dialogParams?: DialogParamsType;
}

const initialState: IDialogState = {
    dialogType: DialogTypeEnum.None,
    autoCloseOnAccept: true,
    dialogProps: undefined,
    dialogParams: null
};

const reducer = (state = initialState, action: IAction): IDialogState => {
    switch (action.type) {
        case actionTypes.OPEN_DIALOG:
            const { dialogType, autoCloseOnAccept, dialogProps, dialogParams } = action.payload;

            return {
                ...state,
                dialogType,
                autoCloseOnAccept,
                dialogProps,
                dialogParams
            };
        case actionTypes.UPDATE_DIALOG:
            return {
                ...state,
                dialogProps: {...state.dialogProps, ...action.payload.dialogProps},
                dialogType: action.payload.dialogType ? action.payload.dialogType : state.dialogType,
                dialogParams: action.payload.dialogParams
            };
        case actionTypes.CLOSE_DIALOG:
            return {
                ...state, ...initialState
            };
    }
    return state;
};

// selectors
const selectors = {

};

export const DialogDuck = {
    actionTypes,
    actionCreators,
    reducer,
    selectors
};
