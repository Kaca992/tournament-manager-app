import { ILocalizationStrings } from "./localizationProvider";

export const strings: ILocalizationStrings = {
    mainLoadingText: "Učitavanje...",
    addNewCategoryButtonText: "Dodaj Kategoriju",
    addNewCompetitionButtonText: "Dodaj Natjecanje",

    Common: {
        mustEnterValueError: 'Morate unijeti vrijednost'
    },

    Navigation: {
        competition: 'Natjecanja'
    },

    Wizards: {
        backButtonText: 'Nazad',
        nextButtonText: 'Dalje',
        cancelButtonText: 'Odustani',

        CompetitionCreator: {
            wizardTitle: 'Kreiranje Natjecanja',
            wizardDescription: 'Kreiranje Novog Natjecanja',
            configurationTitle: 'Konfiguracija',
            configurationDescription: '',
            playersTitle: 'Odabir Igrača',
            playersDescription: '',
            formatTitle: 'Odabir ždrijeba',
            formatDescription: '',
            finishButtonText: 'Kreiraj',

            ConfigForm: {
                categoryDropdownNullText: 'Odaberite kategoriju',
                newCategoryNullText: 'Ime kategorije',
                categoryDropdownTab: 'Postojeće Kategorije',
                newCategoryTab: 'Nova Kategorija',
                categoryErrorMessage: 'Morate odbrati kategoriju.',
                categoryHeaderText: 'Kategorija',
                competitionNameHeaderText: 'Ime Natjecanja',
                competitionNameNullText: 'Unesite ime natjecanja',
            }
        }
    }
};
