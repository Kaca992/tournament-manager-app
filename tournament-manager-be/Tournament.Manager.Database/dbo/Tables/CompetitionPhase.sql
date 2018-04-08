CREATE TABLE [dbo].[CompetitionPhase]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[Settings] NVARCHAR(MAX) NOT NULL,
	[StageId] INT NOT NULL, 
    [IdCompetition] INT NOT NULL,
	[CompetitionPhaseInfoType] SMALLINT NOT NULL, 
    CONSTRAINT [FK_CompetitionPhase_Competition] FOREIGN KEY ([IdCompetition]) REFERENCES [Competition]([Id]) ON DELETE Cascade
)
