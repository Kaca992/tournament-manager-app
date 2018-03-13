import {applyMiddleware, combineReducers, createStore} from 'redux';
import logger from 'redux-logger';
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';

import {MainDuck, IMainState} from './../ducks/main.duck';
import {CategoryDuck, ICategoryState} from './../ducks/categories.duck';

const middleware = [thunk, logger];

const reducersApp = combineReducers({
    main: MainDuck.reducer,
    categories: CategoryDuck.reducer
});

export interface IStore {
  main: IMainState;
  categories: ICategoryState;
}

function configureStore() {
    const store: any = createStore(reducersApp, composeWithDevTools(
        applyMiddleware(...middleware)),
    );
    return store;
}

export default configureStore;
