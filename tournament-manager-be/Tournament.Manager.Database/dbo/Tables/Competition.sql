CREATE TABLE [dbo].[Competition]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [DisplayName] NCHAR(200) NOT NULL, 
    [ConfigJson] NVARCHAR(MAX) NULL, 
    [IdSubCategory] INT NOT NULL, 
    CONSTRAINT [FK_Competition_SubCategory] FOREIGN KEY ([IdSubCategory]) REFERENCES [SubCategory]([Id]) ON DELETE Cascade
)
