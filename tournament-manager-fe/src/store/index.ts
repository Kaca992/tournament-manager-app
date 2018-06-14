import { applyMiddleware, combineReducers, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from "redux-thunk";
// not working with redux v4
// import { composeWithDevTools } from 'redux-devtools-extension';

import { MainDuck, IMainState } from './../ducks/main.duck';
import { DialogDuck, IDialogState } from '../ducks/dialog.duck';
import { NavigationDuck, INavigationState } from './../ducks/navigation.duck';
import { CompetitionDuck, ICompetitionState } from './../ducks/competition.duck';
import { CompetitionStructureDuck, ICompetitionStructureState } from '../ducks/competition.structure.duck';
import { CompetitionPhasesDuck, ICompetitionPhasesState } from '../ducks/competition.phases.duck';
import { FullPageControlDuck, IFullPageControlState } from '../ducks/full.page.control.duck';

const middleware = [thunk, logger];

const reducersApp = combineReducers({
    main: MainDuck.reducer,
    dialog: DialogDuck.reducer,
    fullPageControl: FullPageControlDuck.reducer,
    competitionStructure: CompetitionStructureDuck.reducer,
    competitionPhases: CompetitionPhasesDuck.reducer,
    navigation: NavigationDuck.reducer,
    competitions: CompetitionDuck.reducer
});

export interface IStore {
    main: IMainState;
    dialog: IDialogState;
    fullPageControl: IFullPageControlState;
    competitionStructure: ICompetitionStructureState;
    competitionPhases: ICompetitionPhasesState;
    navigation: INavigationState;
    competitions: ICompetitionState;
}

function configureStore() {
    const store: any = createStore(reducersApp, applyMiddleware(...middleware));
    return store;
}

export default configureStore;
