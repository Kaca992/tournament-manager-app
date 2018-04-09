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

    Competition: {
        playersMenuItem: 'Igrači',
        selectCompetition: 'Odaberite natjecanje iz izbornika sa strane'
    },

    Wizards: {
        backButtonText: 'Nazad',
        nextButtonText: 'Dalje',
        cancelButtonText: 'Odustani',

        CompetitionCreator: {
            creatingCompetitionProgress: 'Kreiranje natjecanja u tijeku...',
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
            },

            PlayerForm: {
                titleText: 'Unesite Igrače',
                playerNameHeader: 'Ime',
                teamHeader: 'Tim',
                rankingHeader: 'Ranking',
                addNewCompetitor: 'Dodaj Igrača',
                finishText: 'Ažuriraj Igrače',
                playerUpdateProgress: 'Ažuriranje igrača u tijeku...'
            },

            TableCompetitonSelector: {
                swapButtonText: 'Zamijeni Igrače',
                swapButtonTooltip: 'Odaberite 2 igrača kojima želite zamijeniti pozicije'
            }
        }
    }
};
