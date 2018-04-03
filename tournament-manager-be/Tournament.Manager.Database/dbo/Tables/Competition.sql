CREATE TABLE [dbo].[Competition]
(
	[Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
    [DisplayName] NCHAR(200) NOT NULL, 
    [IdCategory] INT NOT NULL, 
    CONSTRAINT [FK_Competition_Category] FOREIGN KEY ([IdCategory]) REFERENCES [Category]([Id]) ON DELETE Cascade
)
