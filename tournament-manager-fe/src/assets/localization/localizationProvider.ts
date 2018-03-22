import {strings} from './strings.hr';

export interface ILocalizationStrings {
    mainLoadingText: string;
    addNewCategoryButtonText: string;
    addNewCompetitionButtonText: string;

    Navigation: {
        competition: string;
    };

    Wizards: {
        backButtonText: string;
        nextButtonText: string;
        cancelButtonText: string;

        CompetitionCreator: {
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
                categoryHeader: string;
                categoryDropdownNullText: string;
                newCategoryNullText: string;
                categoryDropdownTab: string;
                newCategoryTab: string;
                categoryErrorMessage: string;
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
