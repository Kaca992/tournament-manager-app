import { createSelector } from 'reselect';
import { IAction, IInitializingStatus } from '../common/interfaces';
import { IStore } from '../store/index';
import { CompetitionsController, CompetitionPhasesController } from '../constants/service.endpoints';
import { ICustomFetchOptions, fetcher, actionUtils } from '../utils/fetcher';
import { ICompetitionPhase, ICompetitionPhaseBaseCompetitor } from '../common/dataStructures/competition.phase';
import { actionCreators as dialogActions } from './dialog.duck';
import { actionCreators as mainActions } from './main.duck';
import { actionCreators as competitionActions } from './competition.duck';
import { ICompetitionPhaseCreationInfo } from '../common/dataStructures/competitionCreation';
import { IMatchInfo } from '../common/matchInfos';

// action types
const actionTypes = {
    INSERT_COMPETITION_PHASE: '@competition-phases/INSERT_COMPETITION_PHASE',
    INSERT_UPDATE_MATCH: '@competition-phases/INSERT_UPDATE_MATCH',
    GET_COMPETITION_PHASES: '@competition-phases/GET_COMPETITION_PHASES',
    SELECT_COMPETITION_PHASE: '@competition-phases/SELECT_COMPETITION_PHASE'
};

// action creators
export const actionCreators = {
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

    insertUpdateMatch(matchInfo: IMatchInfo, removeMatch: boolean) {
        return (dispatch, getState) => {
            const state = getState() as IStore;
            const selectedCompetitionId = state.competitionStructure.selectedCompetitionId;
            const selectedPhaseId = state.competitionPhases.selectedPhaseId;

            let url = CompetitionsController.insertUpdateMatch(selectedCompetitionId, selectedPhaseId, removeMatch);
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
    },

    // TODO: loading of competition phase info. In request we need to set competitionPhaseId to guard from fast switching of tabs
    selectCompetitionPhase(phaseId: number) {
        return (dispatch, getState) => {
            return dispatch({
                type: actionTypes.SELECT_COMPETITION_PHASE,
                payload: phaseId
            });
        };
    },

    getCompetitionPhases(selectedCompetitionId: number) {
        return (dispatch, getState) => {
            let url = CompetitionPhasesController.getPhasesList(selectedCompetitionId);
            let options: ICustomFetchOptions = {
                action: actionTypes.GET_COMPETITION_PHASES,
                hasResult: true
            };

            return fetcher(url, options, dispatch, { method: 'GET' });
        };
    }
};

// reducer
export interface ICompetitionPhasesState {
    selectedPhaseId: number;
    competitionPhases: ICompetitionPhase[] | undefined;
    /** phase matches grouped by phase id */
    phaseMatches: {[phaseId: number]: IMatchInfo[]};
    /** phase competitor ids grouped by phase id */
    phaseCompetitorInfos: {[phaseId: number]: ICompetitionPhaseBaseCompetitor[]};
    initializing: {
        phasesListInitializing?: boolean;
        phaseStatusById?: {[phaseId: number]: IInitializingStatus}
    };
}

const initialState: ICompetitionPhasesState = {
    selectedPhaseId: -1,
    competitionPhases: undefined,
    phaseMatches: {},
    phaseCompetitorInfos: {},
    initializing: {}
};

const reducer = (state = initialState, action: IAction): ICompetitionPhasesState => {
    switch (action.type) {
        case actionUtils.requestAction(actionTypes.GET_COMPETITION_PHASES):
            return {
                ...state,
                competitionPhases: [],
                initializing: {
                    ...state.initializing,
                    phasesListInitializing: true
                }
            };
        case actionUtils.responseAction(actionTypes.GET_COMPETITION_PHASES):
            const competitionPhases = action.payload as ICompetitionPhase[];
            if (!competitionPhases || competitionPhases.length === 0) {
                return {
                    ...state,
                    selectedPhaseId: -1,
                    competitionPhases: [],
                    initializing: {
                        ...state.initializing,
                        phasesListInitializing: false
                    }
                };
            }

            return {
                ...state,
                selectedPhaseId: -1,
                competitionPhases,
                initializing: {
                    ...state.initializing,
                    phasesListInitializing: false
                }
            };
        case actionUtils.errorAction(actionTypes.GET_COMPETITION_PHASES):
            return {
                ...state,
                competitionPhases: [],
                initializing: {
                    ...state.initializing,
                    phasesListInitializing: false
                }
            };
        case actionTypes.SELECT_COMPETITION_PHASE: {
            return {
                ...state,
                selectedPhaseId: action.payload
            };
        }
    }
    return state;
};

const getCompetitionPhases = (state: IStore) => state.competitionPhases.competitionPhases;
const getSelectedPhaseId = (state: IStore) => state.competitionPhases.selectedPhaseId;
const getPhaseMatches = (state: IStore) => state.competitionPhases.phaseMatches;
const getPhaseCompetitorInfos = (state: IStore) => state.competitionPhases.phaseCompetitorInfos;

// selectors
const selectors = {
    getSelectedPhaseInfo: createSelector(
        [getCompetitionPhases, getSelectedPhaseId],
        (phases, selectedId) => phases ? phases.find(phase => phase.competitionPhaseId === selectedId) : undefined
    ),

    competitionInitialized: createSelector(
        [getCompetitionPhases],
        (phases) => phases && phases.length > 0
    ),
    getSelectedPhaseMatches: createSelector(
        [getPhaseMatches, getSelectedPhaseId],
        (phaseMatches, selectedId) => phaseMatches && phaseMatches[selectedId] ? phaseMatches[selectedId] : undefined
    ),

    getSelectedPhaseCompetitorInfos: createSelector(
        [getPhaseCompetitorInfos, getSelectedPhaseId],
        (phaseCompetitorInfos, selectedId) => phaseCompetitorInfos && phaseCompetitorInfos[selectedId] ? phaseCompetitorInfos[selectedId] : undefined
    ),
};

export const CompetitionPhasesDuck = {
    actionTypes,
    actionCreators,
    reducer,
    selectors
};
