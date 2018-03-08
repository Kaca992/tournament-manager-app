CREATE TABLE [dbo].[Player]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [DisplayName] NCHAR(200) NOT NULL, 
    [AdditionalInfoJson] NVARCHAR(MAX) NULL
)
