import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { ICustomFetchOptions, fetcher, actionUtils } from '../utils/fetcher';
import { CompetitionsController, CompetitorsController } from '../constants/service.endpoints';
import { ICompetitionCreationInfo, ICompetitionPhaseCreationInfo } from '../common/dataStructures/competitionCreation';

import { actionCreators as competitionActions } from './competition.structure.duck';
import { actionCreators as dialogActions } from './dialog.duck';
import { actionCreators as mainActions } from './main.duck';
import { actionCreators as competitionPhasesActions } from './competition.phases.duck';
import { DialogTypeEnum } from '../common/enums';
import { LocalizationProvider } from '../assets/localization/localizationProvider';
import { ICompetitorInfo } from '../common/dataStructures/competition';
import { ICustomTableHeader } from '../components/customTable/customTable.utils';

// action types
const actionTypes = {
    CREATE_NEW_COMPETITION: '@competition/CREATE_NEW_COMPETITION',
    GET_COMPETITORS: '@competition/GET_COMPETITORS',
    UPDATE_COMPETITORS: '@competition/UPDATE_COMPETITORS'
};

// action creators
export const actionCreators = {
    /** EXPERIMENTAL: Full wizard with creation of groups included. Base variant is used because player input is usually separate from creation of groups */
    createNewCompetition(competitionSettings: ICompetitionCreationInfo) {
        return (dispatch, getState) => {
            let url = CompetitionsController.createNewCompetition;
            let options: ICustomFetchOptions = {
                action: actionTypes.CREATE_NEW_COMPETITION,
                hasResult: true
            };

            dispatch(dialogActions.openDialog(DialogTypeEnum.LoadingInfo, LocalizationProvider.Strings.Wizards.CompetitionCreator.creatingCompetitionProgress));
            return fetcher(url, options, dispatch, {method: 'POST', body: JSON.stringify(competitionSettings)}).then(competitionId => {
                dispatch(dialogActions.closeDialog());
                dispatch(mainActions.closeFullPageControl());
                dispatch(competitionActions.getCompetitionStrucutre()).then(() => {
                    dispatch(competitionActions.selectCompetition(competitionId));
                });
            });
        };
    },

    createNewCompetitionBase(competitionSettings: ICompetitionCreationInfo) {
        return (dispatch, getState) => {
            let url = CompetitionsController.createNewCompetitionBase;
            let options: ICustomFetchOptions = {
                action: actionTypes.CREATE_NEW_COMPETITION,
                hasResult: true
            };

            dispatch(dialogActions.openDialog(DialogTypeEnum.LoadingInfo, LocalizationProvider.Strings.Wizards.CompetitionCreator.creatingCompetitionProgress));
            return fetcher(url, options, dispatch, {method: 'POST', body: JSON.stringify(competitionSettings)}).then(competitionId => {
                dispatch(dialogActions.closeDialog());
                dispatch(mainActions.closeFullPageControl());
                dispatch(competitionActions.getCompetitionStrucutre()).then(() => {
                    dispatch(competitionActions.selectCompetition(competitionId));
                });
            });
        };
    },

    getCompetitors(selectedCompetitionId: number) {
        return (dispatch, getState) => {
            let url = CompetitorsController.getCompetitors(selectedCompetitionId);
            let options: ICustomFetchOptions = {
                action: actionTypes.GET_COMPETITORS,
                hasResult: true
            };

            return fetcher(url, options, dispatch, {method: 'GET'});
        };
    },

    updateCompetitors(selectedCompetitionId: number, competitors: ICompetitorInfo[]) {
        return (dispatch, getState) => {
            let url = CompetitionsController.updateCompetitors(selectedCompetitionId);
            let options: ICustomFetchOptions = {
                action: actionTypes.UPDATE_COMPETITORS,
                hasResult: false
            };

            return fetcher(url, options, dispatch, {method: 'POST', body: JSON.stringify(competitors)}).then(() => {
                dispatch(actionCreators.getCompetitors(selectedCompetitionId));
                dispatch(competitionPhasesActions.getCompetitionPhases(selectedCompetitionId));
                dispatch(dialogActions.closeDialog());
                dispatch(mainActions.closeFullPageControl());
            });
        };
    }
};

// reducer
export interface ICompetitionState {
    /** List of all competitors in a competition */
    competitors: ICompetitorInfo[] | undefined;
    /** Columns for custom grid on the competitor list */
    competitorColumns: ICustomTableHeader[] | undefined;
    competitorsInitializing: boolean;
}

const initialState: ICompetitionState = {
    competitors: undefined,
    competitorColumns: undefined,
    competitorsInitializing: false
};

const reducer = (state= initialState, action: IAction): ICompetitionState => {
    switch (action.type) {
        case actionUtils.requestAction(actionTypes.GET_COMPETITORS):
            return {
                ...state,
                competitors: undefined,
                competitorColumns: undefined,
                competitorsInitializing: true
            };
        case actionUtils.responseAction(actionTypes.GET_COMPETITORS):
            return {
                ...state,
                competitors: action.payload.competitors,
                competitorColumns: action.payload.competitorColumns,
                competitorsInitializing: false
            };
        case actionUtils.errorAction(actionTypes.GET_COMPETITORS):
            return {
                ...state,
                competitors: undefined,
                competitorColumns: undefined,
                competitorsInitializing: false
            };
    }
    return state;
};

// selectors
const selectors = {

};

export const CompetitionDuck = {
    actionTypes,
    actionCreators,
    reducer,
    selectors
};
