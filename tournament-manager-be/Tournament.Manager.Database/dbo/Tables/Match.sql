CREATE TABLE [dbo].[Match]
(
	[Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
    [IdCompetitor1] INT NOT NULL, 
    [IdCompetitor2] INT NOT NULL, 
    [IdCompetitionPhase] INT NOT NULL, 
    [MatchInfo] NVARCHAR(MAX) NULL, 
    [Leg] INT NOT NULL, 
    CONSTRAINT [FK_Match_Competitor1] FOREIGN KEY ([IdCompetitor1]) REFERENCES [Competitor]([Id]),
	CONSTRAINT [FK_Match_Competitor2] FOREIGN KEY ([IdCompetitor2]) REFERENCES [Competitor]([Id]),
	CONSTRAINT [FK_Match_CompetitionPhase] FOREIGN KEY ([IdCompetitionPhase]) REFERENCES [CompetitionPhase]([Id]) ON DELETE Cascade
)
