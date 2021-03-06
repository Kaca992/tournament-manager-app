/****** Object:  Table [dbo].[Category]    Script Date: 09/04/2018 22:51:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Category](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[DisplayName] [nchar](200) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Competition]    Script Date: 09/04/2018 22:51:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Competition](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[DisplayName] [nchar](200) NOT NULL,
	[IdCategory] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CompetitionPhase]    Script Date: 09/04/2018 22:51:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CompetitionPhase](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Settings] [nvarchar](max) NOT NULL,
	[StageId] [int] NOT NULL,
	[IdCompetition] [int] NOT NULL,
	[CompetitionPhaseInfoType] [smallint] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Competitor]    Script Date: 09/04/2018 22:51:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Competitor](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[IdPlayer] [int] NOT NULL,
	[IdCompetition] [int] NOT NULL,
	[CompetitionInfo] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UNQ_Competitor] UNIQUE NONCLUSTERED 
(
	[IdPlayer] ASC,
	[IdCompetition] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CompetitorPhaseInfo]    Script Date: 09/04/2018 22:51:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CompetitorPhaseInfo](
	[IdCompetitionPhase] [int] NOT NULL,
	[IdCompetitor] [int] NOT NULL,
	[PhaseInfo] [nvarchar](max) NULL,
 CONSTRAINT [PK_CompetitorPhaseInfo] PRIMARY KEY CLUSTERED 
(
	[IdCompetitionPhase] ASC,
	[IdCompetitor] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Match]    Script Date: 09/04/2018 22:51:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Match](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[IdCompetitor1] [int] NOT NULL,
	[IdCompetitor2] [int] NOT NULL,
	[IdCompetitionPhase] [int] NOT NULL,
	[MatchInfo] [nvarchar](max) NULL,
	[Leg] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Player]    Script Date: 09/04/2018 22:51:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Player](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[DisplayName] [nchar](200) NOT NULL,
	[AdditionalInfoJson] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Competition]  WITH CHECK ADD  CONSTRAINT [FK_Competition_Category] FOREIGN KEY([IdCategory])
REFERENCES [dbo].[Category] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Competition] CHECK CONSTRAINT [FK_Competition_Category]
GO
ALTER TABLE [dbo].[CompetitionPhase]  WITH CHECK ADD  CONSTRAINT [FK_CompetitionPhase_Competition] FOREIGN KEY([IdCompetition])
REFERENCES [dbo].[Competition] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CompetitionPhase] CHECK CONSTRAINT [FK_CompetitionPhase_Competition]
GO
ALTER TABLE [dbo].[Competitor]  WITH CHECK ADD  CONSTRAINT [FK_Competitor_Competition] FOREIGN KEY([IdCompetition])
REFERENCES [dbo].[Competition] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Competitor] CHECK CONSTRAINT [FK_Competitor_Competition]
GO
ALTER TABLE [dbo].[Competitor]  WITH CHECK ADD  CONSTRAINT [FK_Competitor_Player] FOREIGN KEY([IdPlayer])
REFERENCES [dbo].[Player] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Competitor] CHECK CONSTRAINT [FK_Competitor_Player]
GO
ALTER TABLE [dbo].[CompetitorPhaseInfo]  WITH CHECK ADD  CONSTRAINT [FK_CompetitionPhaseInfo_CompetitionPhase] FOREIGN KEY([IdCompetitionPhase])
REFERENCES [dbo].[CompetitionPhase] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CompetitorPhaseInfo] CHECK CONSTRAINT [FK_CompetitionPhaseInfo_CompetitionPhase]
GO
ALTER TABLE [dbo].[CompetitorPhaseInfo]  WITH CHECK ADD  CONSTRAINT [FK_CompetitionPhaseInfo_Competitor] FOREIGN KEY([IdCompetitor])
REFERENCES [dbo].[Competitor] ([Id])
GO
ALTER TABLE [dbo].[CompetitorPhaseInfo] CHECK CONSTRAINT [FK_CompetitionPhaseInfo_Competitor]
GO
ALTER TABLE [dbo].[Match]  WITH CHECK ADD  CONSTRAINT [FK_Match_CompetitionPhase] FOREIGN KEY([IdCompetitionPhase])
REFERENCES [dbo].[CompetitionPhase] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Match] CHECK CONSTRAINT [FK_Match_CompetitionPhase]
GO
ALTER TABLE [dbo].[Match]  WITH CHECK ADD  CONSTRAINT [FK_Match_Competitor1] FOREIGN KEY([IdCompetitor1])
REFERENCES [dbo].[Competitor] ([Id])
GO
ALTER TABLE [dbo].[Match] CHECK CONSTRAINT [FK_Match_Competitor1]
GO
ALTER TABLE [dbo].[Match]  WITH CHECK ADD  CONSTRAINT [FK_Match_Competitor2] FOREIGN KEY([IdCompetitor2])
REFERENCES [dbo].[Competitor] ([Id])
GO
ALTER TABLE [dbo].[Match] CHECK CONSTRAINT [FK_Match_Competitor2]
GO
