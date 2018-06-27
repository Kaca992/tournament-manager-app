import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { CompetitionsController } from '../constants/service.endpoints';
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
    INSERT_UPDATE_MATCH: '@competition-phases/INSERT_UPDATE_MATCH'
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
                dispatch(competitionActions.getCompetitionPhases(selectedCompetitionId));
                dispatch(competitionActions.selectCompetitionPhase(phaseId));
            });
        };
    },

    insertUpdateMatch(matchInfo: IMatchInfo, removeMatch: boolean) {
        return (dispatch, getState) => {
            const state = getState() as IStore;
            const selectedCompetitionId = state.competitionStructure.selectedCompetitionId;
            const selectedPhaseId = state.competitions.selectedPhaseId;

            let url = CompetitionsController.insertUpdateMatch(selectedCompetitionId, selectedPhaseId, removeMatch);
            let options: ICustomFetchOptions = {
                action: actionTypes.INSERT_UPDATE_MATCH,
                hasResult: false
            };

            return fetcher(url, options, dispatch, { method: 'POST', body: JSON.stringify(matchInfo) }).then(() => {
                // TODO real update not everything
                dispatch(competitionActions.getCompetitionPhases(selectedCompetitionId));
                dispatch(competitionActions.selectCompetitionPhase(selectedPhaseId));
            });
        };
    }
};

// reducer
export interface ICompetitionPhasesState {
    phaseMatches: IMatchInfo[];
    phaseCompetitorInfos: ICompetitionPhaseBaseCompetitor[];
}

const initialState: ICompetitionPhasesState = {
    phaseMatches: [],
    phaseCompetitorInfos: []
};

const reducer = (state = initialState, action: IAction): ICompetitionPhasesState => {
    switch (action.type) {

    }
    return state;
};

// selectors
const selectors = {

};

export const CompetitionPhasesDuck = {
    actionTypes,
    actionCreators,
    reducer,
    selectors
};
