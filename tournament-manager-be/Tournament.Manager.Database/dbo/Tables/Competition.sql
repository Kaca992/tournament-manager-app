CREATE TABLE [dbo].[Competition]
(
	[Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
    [DisplayName] NCHAR(200) NOT NULL, 
    [ConfigJson] NVARCHAR(MAX) NULL, 
    [IdSubCategory] INT NOT NULL, 
    CONSTRAINT [FK_Competition_SubCategory] FOREIGN KEY ([IdSubCategory]) REFERENCES [SubCategory]([Id]) ON DELETE Cascade
)
