import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { actionUtils } from '../utils/fetcher';

// action types
const actionTypes = {

};

// action creators
const actionCreators = {

};

// reducer
export interface IMainState {

}

const initialState: IMainState = {

};

const reducer = (state= initialState, action: IAction): IMainState => {
    switch (action.type) {

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
