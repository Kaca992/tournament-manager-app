import { createSelector } from 'reselect';
import { IAction } from '../common/interfaces';
import { IStore } from '../store/index';
import { ICustomFetchOptions, fetcher, actionUtils } from '../utils/fetcher';
import { CompetitionsController } from '../constants/service.endpoints';
import { ICompetitionCreationInfo } from '../common/dataStructures/competitionCreation';

import { actionCreators as competitionActions } from './competition.structure.duck';
import { actionCreators as dialogActions } from './dialog.duck';
import { actionCreators as mainActions } from './main.duck';
import { DialogTypeEnum } from '../common/enums';
import { LocalizationProvider } from '../assets/localization/localizationProvider';

// action types
const actionTypes = {
    CREATE_NEW_COMPETITION: '@competition/CREATE_NEW_COMPETITION',
};

// action creators
const actionCreators = {
    createNewCompetition(competitionSettings: ICompetitionCreationInfo) {
        return (dispatch, getState) => {
            let url = CompetitionsController.createNewCompetition ;
            let options: ICustomFetchOptions = {
                action: actionTypes.CREATE_NEW_COMPETITION,
                hasResult: true
            };

            dispatch(dialogActions.openDialog(DialogTypeEnum.LoadingInfo, LocalizationProvider.Strings.Wizards.CompetitionCreator.creatingCompetitionProgress));
            return fetcher(url, options, dispatch, {method: 'POST', body: JSON.stringify(competitionSettings)}).then(competitionId => {
                dispatch(dialogActions.closeDialog());
                dispatch(mainActions.closeCompetitionWizard());
                dispatch(competitionActions.getCompetitionStrucutre()).then(() => {
                    dispatch(competitionActions.selectCompetition(competitionId));
                });
            });
        };
    }
};

// reducer
export interface ICompetitionState {

}

const initialState: ICompetitionState = {

};

const reducer = (state= initialState, action: IAction): ICompetitionState => {
    switch (action.type) {

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
