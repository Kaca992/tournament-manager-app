export enum ControlTypeEnum {
    None = 0,
    Main = 1,
    FullPageControl
}

export enum FullPageControlTypeEnum {
    None = 0,
    /** EXPERIMENTAL: Full wizard with creation of groups included. Base variant is used because player input is usually separate from creation of groups */
    CompetitionWizard = 1,
    CompetitionWizardBase = 2,
    EditCompetitors = 3,
    CreateNewCompetitionPhase = 4
}

export enum DialogTypeEnum {
    None = 0,
    LoadingInfo = 1,
    Message = 2
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

export enum CompetitionTypeEnum {
    TableTennisTournament = 1
}

export enum InitializingStatusEnum {
    None,
    Initializing,
    Initialized
}
