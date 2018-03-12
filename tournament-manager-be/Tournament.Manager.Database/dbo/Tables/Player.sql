CREATE TABLE [dbo].[Player]
(
	[Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
    [DisplayName] NCHAR(200) NOT NULL, 
    [AdditionalInfoJson] NVARCHAR(MAX) NULL
)
