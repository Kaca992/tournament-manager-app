import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { ICategory } from '../common/dataStructures/common';
import { CompetitionStructureController } from '../constants/service.endpoints';
import { ICustomFetchOptions, fetcher, actionUtils } from '../utils/fetcher';

// action types
const actionTypes = {
    GET_COMPETITION_STRUCTURE: '@competition-structure/GET_COMPETITION_STRUCTURE',
    SELECT_COMPETITION: '@competition-structure/SELECT_COMPETITION'
};

// action creators
const actionCreators = {
    getCompetitionStrucutre() {
        return (dispatch, getState) => {
            let url = CompetitionStructureController.getCompetitionStructure ;
            let options: ICustomFetchOptions = {
                action: actionTypes.GET_COMPETITION_STRUCTURE,
                hasResult: true
            };

            return fetcher(url, options, dispatch, {method: 'GET'});
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
export interface ICompetitionStructureState {
    isInitializing: boolean;
    categories: ICategory[];
    selectedCompetitionId: number;
}

const initialState: ICompetitionStructureState = {
    isInitializing: true,
    categories: [],
    selectedCompetitionId: -1
};

const reducer = (state= initialState, action: IAction): ICompetitionStructureState => {
    switch (action.type) {
        case actionUtils.requestAction(actionTypes.GET_COMPETITION_STRUCTURE):
            return {
                ...state,
                ...initialState
            };
        case actionUtils.responseAction(actionTypes.GET_COMPETITION_STRUCTURE):
            const categories: ICategory[] = action.payload;
            return {
                ...state,
                categories,
                isInitializing: false
            };
        case actionUtils.errorAction(actionTypes.GET_COMPETITION_STRUCTURE):
            return {
                ...state,
                categories: [],
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

export const CompetitionStructureDuck = {
    actionTypes,
    actionCreators,
    reducer,
    selectors
};
