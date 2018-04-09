CREATE TABLE [dbo].[CompetitorPhaseInfo]
(
	[IdCompetitionPhase] INT NOT NULL, 
    [IdCompetitor] INT NOT NULL, 
    [PhaseInfo] NVARCHAR(MAX) NULL,
	CONSTRAINT PK_CompetitorPhaseInfo PRIMARY KEY (IdCompetitionPhase,IdCompetitor),
	CONSTRAINT [FK_CompetitionPhaseInfo_CompetitionPhase] FOREIGN KEY ([IdCompetitionPhase]) REFERENCES [CompetitionPhase]([Id]) ON DELETE Cascade,
	CONSTRAINT [FK_CompetitionPhaseInfo_Competitor] FOREIGN KEY ([IdCompetitor]) REFERENCES [Competitor]([Id])
)
