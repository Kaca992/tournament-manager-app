import {applyMiddleware, combineReducers, createStore} from 'redux';
import logger from 'redux-logger';
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';

import {MainDuck, IMainState} from './../ducks/main.duck';
import {NavigationDuck, INavigationState} from './../ducks/navigation.duck';
import {CompetitionDuck, ICompetitionState} from './../ducks/competition.duck';
import { CompetitionStructureDuck, ICompetitionStructureState } from '../ducks/competition.structure.duck';

const middleware = [thunk, logger];

const reducersApp = combineReducers({
    main: MainDuck.reducer,
    competitionStructure: CompetitionStructureDuck.reducer,
    navigation: NavigationDuck.reducer,
    competitions: CompetitionDuck.reducer
});

export interface IStore {
  main: IMainState;
  competitionStructure: ICompetitionStructureState;
  navigation: INavigationState;
  competitions: ICompetitionState;
}

function configureStore() {
    const store: any = createStore(reducersApp, composeWithDevTools(
        applyMiddleware(...middleware)),
    );
    return store;
}

export default configureStore;
