import {strings} from './strings.hr';

export interface ILocalizationStrings {
    mainLoadingText: string;
    addNewCategoryButtonText: string;
    addNewCompetitionButtonText: string;

    Common: {
        mustEnterValueError: string;
    };

    Navigation: {
        competition: string;
    };

    Competition: {
        playersMenuItem: string
        selectCompetition: string;
    };

    UpdateCompetitors: {
        titleText: string;
        buttonText: string;
        playerUpdateProgress: string;
    };

    Wizards: {
        backButtonText: string;
        nextButtonText: string;
        cancelButtonText: string;

        CompetitionCreator: {
            creatingCompetitionProgress: string;
            wizardTitle: string;
            wizardDescription: string;
            configurationTitle: string;
            configurationDescription: string;
            playersTitle: string;
            playersDescription: string;
            formatTitle: string;
            formatDescription: string;
            finishButtonText: string;

            ConfigForm: {
                categoryDropdownNullText: string;
                newCategoryNullText: string;
                categoryDropdownTab: string;
                newCategoryTab: string;
                categoryErrorMessage: string;
                categoryHeaderText: string;
                competitionNameHeaderText: string;
                competitionNameNullText: string;
            };

            PlayerForm: {
                titleText: string;
                playerNameHeader: string;
                teamHeader: string;
                rankingHeader: string;
                addNewCompetitor: string;
            }

            TableCompetitonSelector: {
                swapButtonText: string;
                swapButtonTooltip: string;
            }
        }
    };
}

type LocalizationTypes = 'hr' | 'eng';

export class LocalizationProvider {
    private static strings: ILocalizationStrings;
    public  static get Strings(): ILocalizationStrings {
        return LocalizationProvider.strings;
    }

    // tslint:disable-next-line:member-ordering
    public static RegisterProvider(language: LocalizationTypes) {
        switch (language) {
            case 'hr':
                LocalizationProvider.strings = strings;
                return;
        }

        LocalizationProvider.strings = strings;
    }
}
