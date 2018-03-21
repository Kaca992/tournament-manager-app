import { ILocalizationStrings } from "./localizationProvider";

export const strings: ILocalizationStrings = {
    mainLoadingText: "Učitavanje...",
    addNewCategoryButtonText: "Dodaj Kategoriju",
    addNewCompetitionButtonText: "Dodaj Natjecanje",

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
            finishButtonText: 'Kreiraj'
        }
    }
};
