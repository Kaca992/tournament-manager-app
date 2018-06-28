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
import { InitializingStatusEnum, MenuType } from 'enums';

// action types
const actionTypes = {
    INSERT_COMPETITION_PHASE: '@competition-phases/INSERT_COMPETITION_PHASE',
    INSERT_UPDATE_MATCH: '@competition-phases/INSERT_UPDATE_MATCH',
    GET_COMPETITION_PHASES: '@competition-phases/GET_COMPETITION_PHASES',
    SELECT_COMPETITION_PHASE: '@competition-phases/SELECT_COMPETITION_PHASE',
    GET_COMPETITION_PHASE_INFORMATION: '@competition-phases/GET_COMPETITION_PHASE_INFORMATION'
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
                dispatch(actionCreators.selectCompetitionPhase(MenuType.Phase, phaseId));
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
                dispatch(actionCreators.selectCompetitionPhase(MenuType.Phase, selectedPhaseId));
            });
        };
    },

    selectCompetitionPhase(selectedMenu: MenuType, phaseId: number) {
        return (dispatch, getState) => {
            const state = getState() as IStore;
            const phaseStatus = getPhaseStatus(phaseId, state);

            // if phase is -1 then it is Players or Admin tab
            // or if already initialized phase data, no need to refetch data
            if (selectedMenu !== MenuType.Phase || phaseId === -1 || phaseStatus.initializingStatus === InitializingStatusEnum.Initialized) {
                return dispatch({ type: actionTypes.SELECT_COMPETITION_PHASE, payload: {phaseId, selectedMenu} });
            }

            let url = CompetitionPhasesController.getPhaseInformation(phaseId);
            let options: ICustomFetchOptions = {
                action: actionTypes.GET_COMPETITION_PHASE_INFORMATION,
                hasResult: true,
                requestActionPayload: phaseId
            };

            return fetcher(url, options, dispatch, { method: 'GET' });
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
    selectedMenu: MenuType;
    competitionPhases: ICompetitionPhase[] | undefined;
    /** phase matches grouped by phase id */
    phaseMatches: {[phaseId: number]: IMatchInfo[]};
    /** phase competitor ids grouped by phase id */
    phaseCompetitorInfos: {[phaseId: number]: ICompetitionPhaseBaseCompetitor[]};
    initializing: {
        phasesListInitializing?: boolean;
        phaseStatusById: {[phaseId: number]: IInitializingStatus}
    };
}

const initialState: ICompetitionPhasesState = {
    selectedPhaseId: -1,
    selectedMenu: MenuType.Players,
    competitionPhases: undefined,
    phaseMatches: {},
    phaseCompetitorInfos: {},
    initializing: {
        phaseStatusById: {}
    }
};

const reducer = (state = initialState, action: IAction): ICompetitionPhasesState => {
    switch (action.type) {
        case actionUtils.requestAction(actionTypes.GET_COMPETITION_PHASES):
            return {
                ...state,
                ...initialState,
                initializing: {
                    phaseStatusById: {},
                    phasesListInitializing: true
                }
            };
        case actionUtils.responseAction(actionTypes.GET_COMPETITION_PHASES):
            const competitionPhases = action.payload as ICompetitionPhase[];
            if (!competitionPhases || competitionPhases.length === 0) {
                return {
                    ...state,
                    initializing: {
                        ...state.initializing,
                        phasesListInitializing: false
                    }
                };
            }

            return {
                ...state,
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
                selectedPhaseId: action.payload.phaseId,
                selectedMenu: action.payload.selectedMenu
            };
        }
        case actionUtils.requestAction(actionTypes.GET_COMPETITION_PHASE_INFORMATION): {
            const selectedPhaseId = action.payload;
            const phaseStatusesById = {...state.initializing.phaseStatusById};
            phaseStatusesById[selectedPhaseId] = { initializingStatus: InitializingStatusEnum.Initializing };

            return {
                ...state,
                initializing: {
                    ...state.initializing,
                    phaseStatusById: phaseStatusesById
                },
                selectedPhaseId,
                selectedMenu: MenuType.Phase
            };
        }
        case actionUtils.responseAction(actionTypes.GET_COMPETITION_PHASE_INFORMATION): {
            const { phaseId, matches, competitors } = action.payload;
            const phaseStatusesById = {...state.initializing.phaseStatusById};
            const phaseMatches = {...state.phaseMatches};
            const phaseCompetitorInfos = {...state.phaseCompetitorInfos};

            phaseStatusesById[phaseId] = {initializingStatus: InitializingStatusEnum.Initialized};
            phaseMatches[phaseId] = matches;
            phaseCompetitorInfos[phaseId] = competitors;

            return {
                ...state,
                initializing: {
                    ...state.initializing,
                    phaseStatusById: phaseStatusesById
                },
                phaseMatches,
                phaseCompetitorInfos
            };
        }
        // TODO: error handling
        case actionUtils.errorAction(actionTypes.GET_COMPETITION_PHASE_INFORMATION): {
            return state;
        }
    }
    return state;
};

const getCompetitionPhases = (state: IStore) => state.competitionPhases.competitionPhases;
const getSelectedPhaseId = (state: IStore) => state.competitionPhases.selectedPhaseId;
const getPhaseMatches = (state: IStore) => state.competitionPhases.phaseMatches;
const getPhaseCompetitorInfos = (state: IStore) => state.competitionPhases.phaseCompetitorInfos;
const getPhaseStatuses = (state: IStore) => state.competitionPhases.initializing.phaseStatusById;

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

    getSelectedPhaseStatus: createSelector(
        [getPhaseStatuses, getSelectedPhaseId],
        (phaseStatuses, selectedId) => phaseStatuses && phaseStatuses[selectedId] ? phaseStatuses[selectedId] : { initializingStatus: InitializingStatusEnum.None }
    )
};

function getPhaseStatus(phaseId: number, state: IStore): IInitializingStatus {
    const phaseStatuses = state.competitionPhases.initializing.phaseStatusById;
    if (!phaseStatuses || !phaseStatuses[phaseId]) {
        return { initializingStatus: InitializingStatusEnum.None };
    }

    return phaseStatuses[phaseId];
}

export const CompetitionPhasesDuck = {
    actionTypes,
    actionCreators,
    reducer,
    selectors
};
