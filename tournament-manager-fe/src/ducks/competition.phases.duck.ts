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
    selectedPhaseId: number;
    phases: ICompetitionPhase[];
    phasesInitializing: boolean;
}

const initialState: ICompetitionPhasesState = {
    selectedPhaseId: -1,
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
            const phases = action.payload as ICompetitionPhase[];
            if (!phases || phases.length === 0) {
                return {
                    ...state,
                    selectedPhaseId: -1,
                    phases: [],
                    phasesInitializing: false
                };
            }

            return {
                ...state,
                selectedPhaseId: phases[0].competitionPhaseId,
                phases,
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

const getCompetitionPhases = (state: IStore) => state.competitionPhases.phases;
const getSelectedPhaseId = (state: IStore) => state.competitionPhases.selectedPhaseId;
// selectors
const selectors = {
    getSelectedPhaseInfo : createSelector(
        [ getCompetitionPhases, getSelectedPhaseId ],
        (phases, selectedId) => phases.find(phase => phase.competitionPhaseId === selectedId)
    )
};

export const CompetitionPhasesDuck = {
    actionTypes,
    actionCreators,
    reducer,
    selectors
};
