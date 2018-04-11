import { createSelector } from 'reselect';
import { IAction, IDialogProps } from '../common/interfaces';
import { IStore } from '../store/index';
import { DialogTypeEnum } from '../common/enums';

// action types
const actionTypes = {
    OPEN_DIALOG: '@main/OPEN_DIALOG',
    UPDATE_DIALOG: '@main/UPDATE_DIALOG',
    CLOSE_DIALOG: '@main/CLOSE_DIALOG'
};

// action creators
export const actionCreators = {
    openDialog(dialogType: DialogTypeEnum, dialogParams?: any, dialogProps?: IDialogProps, autoCloseOnAccept: boolean = true) {
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
    updateDialog: (dialogProps: Partial<IDialogProps>, dialogParams?: any) => ({ type: actionTypes.UPDATE_DIALOG, payload: { dialogProps, dialogParams } }),
    closeDialog: () => ({ type: actionTypes.CLOSE_DIALOG })
};

// reducer
export interface IDialogState {
    dialogType: DialogTypeEnum;
    autoCloseOnAccept: boolean;
    dialogProps?: IDialogProps;
    dialogParams?: any;
}

const initialState: IDialogState = {
    dialogType: DialogTypeEnum.None,
    autoCloseOnAccept: true,
    dialogProps: undefined,
    dialogParams: undefined
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
