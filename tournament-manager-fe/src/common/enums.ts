export enum ControlTypeEnum {
    None = 0,
    Main = 1,
    FullPageControl
}

export enum FullPageControlTypeEnum {
    None = 0,
    CompetitionWizard = 1,
    CompetitionWizardBase = 2,
    EditCompetitors = 3,
    CreateNewCompetitionPhase = 4
}

export enum DialogTypeEnum {
    None = 0,
    LoadingInfo = 1,
    Error = 2,
    Consent = 3
}

export enum NavigationTypeEnum {
    Competitions = 0
}

// competition setup
export enum CompetitionPhaseTypeEnum {
    Table = 0,
    Knockout = 1
}

export enum ScheduleTypeEnum {
    RoundRobinScheduleEnum = 0
}

export enum MatchInfoTypeEnum {
    TableTennisTournament = 0
}

export enum CompetititorInfoTypeEnum {
    TableTennisTournament = 0
}
