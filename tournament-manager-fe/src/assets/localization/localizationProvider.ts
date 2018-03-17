import {strings} from './strings.hr';

export interface ILocalizationStrings {
    mainLoadingText: string;
    addNewCategoryButtonText: string;
    addNewCompetitionButtonText: string;
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
