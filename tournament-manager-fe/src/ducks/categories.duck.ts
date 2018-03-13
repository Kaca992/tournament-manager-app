import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { ICategory } from '../common/dataStructures';
import { CategoriesController } from '../constants/service.endpoints';
import { ICustomFetchOptions, fetcher, actionUtils } from '../utils/fetcher';

// action types
const actionTypes = {
    GET_CATEGORIES : '@categories/GET_CATEGORIES'
};

// action creators
const actionCreators = {
    getCategories() {
        return (dispatch, getState) => {
            let url = CategoriesController.allCategories;
            let options: ICustomFetchOptions = {
                action: actionTypes.GET_CATEGORIES,
                hasResult: true
            };

            return fetcher(url, options, dispatch, {method: 'GET'});
        };
    }
};

// reducer
export interface ICategoryState {
    isInitializing: boolean;
    categories: ICategory[];

}

const initialState: ICategoryState = {
    isInitializing: true,
    categories: []
};

const reducer = (state= initialState, action: IAction): ICategoryState => {
    switch (action.type) {
        case actionUtils.requestAction(actionTypes.GET_CATEGORIES):
            return {
                ...state,
                ...initialState
            };
        case actionUtils.responseAction(actionTypes.GET_CATEGORIES):
            return {
                ...state,
                categories: action.payload,
                isInitializing: false
            };
        case actionUtils.errorAction(actionTypes.GET_CATEGORIES):
            return {
                ...state,
                categories: [],
                isInitializing: false
            };

    }
    return state;
};

// selectors
const selectors = {

};

export const CategoryDuck = {
    actionTypes,
    actionCreators,
    reducer,
    selectors
};
