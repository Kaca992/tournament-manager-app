CREATE TABLE [dbo].[SubCategory]
(
	[Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
    [DisplayName] NCHAR(200) NOT NULL, 
    [IdCategory] INT NOT NULL, 
    CONSTRAINT [FK_SubCategory_Category] FOREIGN KEY ([IdCategory]) REFERENCES [Category]([Id]) ON DELETE Cascade
)
