import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { ICategory } from '../common/dataStructures';
import { CategoriesController } from '../constants/service.endpoints';
import { ICustomFetchOptions, fetcher, actionUtils } from '../utils/fetcher';

// action types
const actionTypes = {
    GET_CATEGORIES: '@categories/GET_CATEGORIES',
    SELECT_CATEGORY: '@categories/SELECT_CATEGORY'
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
    },

    selectCategory(categoryId: number) {
        return {
            type: actionTypes.SELECT_CATEGORY,
            payload: categoryId
        };
    }
};

// reducer
export interface ICategoryState {
    isInitializing: boolean;
    categories: ICategory[];
    selectedCategoryId: number;

}

const initialState: ICategoryState = {
    isInitializing: true,
    categories: [],
    selectedCategoryId: -1
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
        case actionTypes.SELECT_CATEGORY:
            return {
                ...state,
                selectedCategoryId: action.payload
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
