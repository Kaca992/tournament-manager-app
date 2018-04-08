import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { CompetitionsController } from '../constants/service.endpoints';
import { ICustomFetchOptions, fetcher, actionUtils } from '../utils/fetcher';
import { ICompetitionPhase } from '../common/dataStructures/competition';

// action types
const actionTypes = {
    GET_COMPETITION_PHASES: '@competition-phases/GET_COMPETITION_PHASES'
};

// action creators
export const actionCreators = {
    getCompetitionPhases(selectedCompetitionId: number) {
        return (dispatch, getState) => {
            let url = CompetitionsController.getPhases(selectedCompetitionId);
            let options: ICustomFetchOptions = {
                action: actionTypes.GET_COMPETITION_PHASES,
                hasResult: true
            };

            return fetcher(url, options, dispatch, {method: 'GET'});
        };
    }
};

// reducer
export interface ICompetitionPhasesState {
    phases: ICompetitionPhase[];
    phasesInitializing: boolean;
}

const initialState: ICompetitionPhasesState = {
    phases: [],
    phasesInitializing: false
};

const reducer = (state= initialState, action: IAction): ICompetitionPhasesState => {
    switch (action.type) {
        case actionUtils.requestAction(actionTypes.GET_COMPETITION_PHASES):
            return {
                ...state,
                phases: [],
                phasesInitializing: true
            };
        case actionUtils.responseAction(actionTypes.GET_COMPETITION_PHASES):
            return {
                ...state,
                phases: action.payload,
                phasesInitializing: false
            };
        case actionUtils.errorAction(actionTypes.GET_COMPETITION_PHASES):
            return {
                ...state,
                phases: [],
                phasesInitializing: false
            };
    }
    return state;
};

// selectors
const selectors = {

};

export const CompetitionPhasesDuck = {
    actionTypes,
    actionCreators,
    reducer,
    selectors
};
