CREATE FUNCTION [dbo].[slugify]
(   
    @str VARCHAR(100)
)
RETURNS VARCHAR(100)
AS
BEGIN
DECLARE @wrongChars SMALLINT
SET @str = LOWER(@str)
SET @wrongChars = PATINDEX('%[^0-9a-z ]%',@str)
WHILE @wrongChars > 0
BEGIN
SET @str = STUFF(@str,@wrongChars,1,'')
SET @wrongChars = PATINDEX('%[^0-9a-z ]%',@str)
END
SET @str = REPLACE(@str,' ','-')
RETURN @str
END