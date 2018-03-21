import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { ICustomFetchOptions, fetcher, actionUtils } from '../utils/fetcher';

// action types
const actionTypes = {

};

// action creators
const actionCreators = {

};

// reducer
export interface ICompetitionState {

}

const initialState: ICompetitionState = {
    isInitializing: true,
    competitions: [],
    selectedCompetitionId: -1
};

const reducer = (state= initialState, action: IAction): ICompetitionState => {
    switch (action.type) {

    }
    return state;
};

// selectors
const selectors = {

};

export const CompetitionDuck = {
    actionTypes,
    actionCreators,
    reducer,
    selectors
};
