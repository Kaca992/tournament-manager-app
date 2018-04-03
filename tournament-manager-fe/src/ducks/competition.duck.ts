import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { ICustomFetchOptions, fetcher, actionUtils } from '../utils/fetcher';
import { CompetitionsController } from '../constants/service.endpoints';
import { ICompetitionCreationInfo } from '../common/dataStructures/competitionCreation';

// action types
const actionTypes = {
    CREATE_NEW_COMPETITION: '@competition/CREATE_NEW_COMPETITION',
};

// action creators
const actionCreators = {
    createNewCompetition(competitionSettings: ICompetitionCreationInfo) {
        return (dispatch, getState) => {
            let url = CompetitionsController.createNewCompetition ;
            let options: ICustomFetchOptions = {
                action: actionTypes.CREATE_NEW_COMPETITION,
                hasResult: false
            };

            return fetcher(url, options, dispatch, {method: 'POST', body: JSON.stringify(competitionSettings)});
        };
    }
};

// reducer
export interface ICompetitionState {

}

const initialState: ICompetitionState = {

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
