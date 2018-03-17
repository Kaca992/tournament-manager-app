import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { ICategory } from '../common/dataStructures';
import { CategoriesController } from '../constants/service.endpoints';
import { ICustomFetchOptions, fetcher, actionUtils } from '../utils/fetcher';
import { CompetitionDuck } from './competition.duck';
import { MainDuck } from './main.duck';

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
        return (dispatch, getState) => {
            const state: IStore = getState();
            dispatch({ type: actionTypes.SELECT_CATEGORY, payload: categoryId });

            if (state.categories.selectedCategoryId !== categoryId) {
                dispatch(CompetitionDuck.actionCreators.getCompetitions(categoryId));
                dispatch(MainDuck.actionCreators.showCompetitionMenu());
            } else {
                dispatch(MainDuck.actionCreators.toggleCompetitionMenu());
            }
        };
    }
};

function appendDefaultIcon(category: ICategory) {
    if (!category.iconName) {
        return {
            ...category,
            iconName: 'trophy'
        };
    }

    return category;
}

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
            const categories = action.payload as ICategory[];
            return {
                ...state,
                categories: categories.map(appendDefaultIcon),
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
const getCategories = (state: IStore) => state.categories.categories;
const getSelectedCategoryId = (state: IStore) => state.categories.selectedCategoryId;

const selectors = {
    getCategory : createSelector(
        [ getCategories, getSelectedCategoryId ],
        (categories, selectedCategoryId) => categories.find(category => category.id === selectedCategoryId)
    )
};

export const CategoryDuck = {
    actionTypes,
    actionCreators,
    reducer,
    selectors
};
