CREATE TABLE [dbo].[Match]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [IdCompetitor1] INT NOT NULL, 
    [IdCompetitor2] INT NOT NULL, 
    [IdCompetition] INT NOT NULL, 
    [MatchInfo] NVARCHAR(MAX) NULL, 
    CONSTRAINT [FK_Match_Competitor1] FOREIGN KEY ([IdCompetitor1]) REFERENCES [Competitor]([Id]),
	CONSTRAINT [FK_Match_Competitor2] FOREIGN KEY ([IdCompetitor2]) REFERENCES [Competitor]([Id]),
	CONSTRAINT [FK_Match_Competition] FOREIGN KEY ([IdCompetition]) REFERENCES [Competition]([Id]) ON DELETE Cascade
)
