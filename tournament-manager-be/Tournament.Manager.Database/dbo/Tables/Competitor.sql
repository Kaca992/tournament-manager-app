CREATE TABLE [dbo].[Competitor]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [IdPlayer] INT NOT NULL, 
    [IdCompetition] INT NOT NULL, 
    [CompetitionInfo] NVARCHAR(MAX) NULL,
	CONSTRAINT UNQ_Competitor UNIQUE(IdPlayer, IdCompetition),
    CONSTRAINT [FK_Competitor_Player] FOREIGN KEY ([IdPlayer]) REFERENCES [Player]([Id]) ON DELETE Cascade, 
    CONSTRAINT [FK_Competitor_Competition] FOREIGN KEY ([IdCompetition]) REFERENCES [Competition]([Id]) ON DELETE Cascade
)
