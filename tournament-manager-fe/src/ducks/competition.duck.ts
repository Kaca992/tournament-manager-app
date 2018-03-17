import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { ICompetition } from '../common/dataStructures';
import { ICustomFetchOptions, fetcher, actionUtils } from '../utils/fetcher';
import { CompetitionsController } from '../constants/service.endpoints';

// action types
const actionTypes = {
    GET_COMPETITIONS: '@competitions/GET_COMPETITIONS',
    SELECT_COMPETITION: '@competitions/SELECT_COMPETITION'
};

// action creators
const actionCreators = {
    getCompetitions(categoryId: number) {
        return (dispatch, getState) => {
            let url = CompetitionsController.allCompetitions(categoryId);
            let options: ICustomFetchOptions = {
                action: actionTypes.GET_COMPETITIONS,
                hasResult: true
            };

            return fetcher(url, options, dispatch, {method: 'GET'})
                .then((competitions: ICompetition[]) => {
                    if (competitions && competitions[0]) {
                        dispatch(actionCreators.selectCompetition(competitions[0].id));
                        return Promise.resolve(competitions[0].id);
                    }
                    dispatch(actionCreators.selectCompetition(-1));
                    return Promise.resolve(-1);
            });
        };
    },

    selectCompetition(competitionId: number) {
        return {
            type: actionTypes.SELECT_COMPETITION,
            payload: competitionId
        };
    }
};

// reducer
export interface ICompetitionState {
    isInitializing: boolean;
    competitions: ICompetition[];
    selectedCompetitionId: number;
}

const initialState: ICompetitionState = {
    isInitializing: true,
    competitions: [],
    selectedCompetitionId: -1
};

const reducer = (state= initialState, action: IAction): ICompetitionState => {
    switch (action.type) {
        case actionUtils.requestAction(actionTypes.GET_COMPETITIONS):
            return {
                ...state,
                ...initialState
            };
        case actionUtils.responseAction(actionTypes.GET_COMPETITIONS):
            const competitions: ICompetition[] = action.payload;
            return {
                ...state,
                competitions,
                isInitializing: false
            };
        case actionUtils.errorAction(actionTypes.GET_COMPETITIONS):
            return {
                ...state,
                competitions: [],
                isInitializing: false
            };
        case actionTypes.SELECT_COMPETITION:
            return {
                ...state,
                selectedCompetitionId: action.payload
            };
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
