import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { CompetitionsController } from '../constants/service.endpoints';
import { ICustomFetchOptions, fetcher, actionUtils } from '../utils/fetcher';
import { ICompetitionPhase } from '../common/dataStructures/competition';
import { actionCreators as dialogActions } from './dialog.duck';
import { actionCreators as mainActions } from './main.duck';
import { ICompetitionPhaseCreationInfo } from '../common/dataStructures/competitionCreation';
import { IMatchInfo } from '../common/matchInfos';

// action types
const actionTypes = {
    GET_COMPETITION_PHASES: '@competition-phases/GET_COMPETITION_PHASES',
    INSERT_COMPETITION_PHASE: '@competition-phases/INSERT_COMPETITION_PHASE',
    SELECT_COMPETITION_PHASE: '@competition-phases/SELECT_COMPETITION_PHASE',
    INSERT_UPDATE_MATCH: '@competition-phases/INSERT_UPDATE_MATCH'
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

            return fetcher(url, options, dispatch, { method: 'GET' });
        };
    },

    createCompetitionPhase(selectedCompetitionId: number, competitionSettings: ICompetitionPhaseCreationInfo) {
        return (dispatch, getState) => {
            let url = CompetitionsController.createNewPhase(selectedCompetitionId);
            let options: ICustomFetchOptions = {
                action: actionTypes.INSERT_COMPETITION_PHASE,
                hasResult: true
            };

            return fetcher(url, options, dispatch, { method: 'POST', body: JSON.stringify(competitionSettings) }).then((phaseId) => {
                dispatch(dialogActions.closeDialog());
                dispatch(mainActions.closeFullPageControl());
                // TODO real update not everything
                dispatch(actionCreators.getCompetitionPhases(selectedCompetitionId));
                dispatch(actionCreators.selectCompetitionPhase(phaseId));
            });
        };
    },

    selectCompetitionPhase(phaseId: number) {
        return (dispatch, getState) => {
            return dispatch({
                type: actionTypes.SELECT_COMPETITION_PHASE,
                payload: phaseId
            });
        };
    },

    insertUpdateMatch(matchInfo: IMatchInfo) {
        return (dispatch, getState) => {
            const state = getState() as IStore;
            const selectedCompetitionId = state.competitionStructure.selectedCompetitionId;
            const selectedPhaseId = state.competitionPhases.selectedPhaseId;

            let url = CompetitionsController.insertUpdateMatch(selectedCompetitionId);
            let options: ICustomFetchOptions = {
                action: actionTypes.INSERT_UPDATE_MATCH,
                hasResult: false
            };

            return fetcher(url, options, dispatch, { method: 'POST', body: JSON.stringify(matchInfo) }).then(() => {
                // TODO real update not everything
                dispatch(actionCreators.getCompetitionPhases(selectedCompetitionId));
                dispatch(actionCreators.selectCompetitionPhase(selectedPhaseId));
            });
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

const reducer = (state = initialState, action: IAction): ICompetitionPhasesState => {
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
        case actionTypes.SELECT_COMPETITION_PHASE: {
            return {
                ...state,
                selectedPhaseId: action.payload
            }
        }
    }
    return state;
};

const getCompetitionPhases = (state: IStore) => state.competitionPhases.phases;
const getSelectedPhaseId = (state: IStore) => state.competitionPhases.selectedPhaseId;
// selectors
const selectors = {
    getSelectedPhaseInfo: createSelector(
        [getCompetitionPhases, getSelectedPhaseId],
        (phases, selectedId) => phases.find(phase => phase.competitionPhaseId === selectedId)
    ),

    competitionInitialized: createSelector(
        [getCompetitionPhases],
        (phases) => phases && phases.length > 0
    ),
};

export const CompetitionPhasesDuck = {
    actionTypes,
    actionCreators,
    reducer,
    selectors
};
