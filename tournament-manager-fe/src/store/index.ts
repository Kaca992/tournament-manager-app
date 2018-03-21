import {applyMiddleware, combineReducers, createStore} from 'redux';
import logger from 'redux-logger';
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';

import {MainDuck, IMainState} from './../ducks/main.duck';
import {NavigationDuck, INavigationState} from './../ducks/navigation.duck';
import {CategoryDuck, ICategoryState} from './../ducks/categories.duck';
import {CompetitionDuck, ICompetitionState} from './../ducks/competition.duck';

const middleware = [thunk, logger];

const reducersApp = combineReducers({
    main: MainDuck.reducer,
    navigation: NavigationDuck.reducer,
    categories: CategoryDuck.reducer,
    competitions: CompetitionDuck.reducer
});

export interface IStore {
  main: IMainState;
  navigation: INavigationState;
  categories: ICategoryState;
  competitions: ICompetitionState;
}

function configureStore() {
    const store: any = createStore(reducersApp, composeWithDevTools(
        applyMiddleware(...middleware)),
    );
    return store;
}

export default configureStore;
