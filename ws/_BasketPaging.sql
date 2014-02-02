USE [DBPetra]
GO
/****** Object:  StoredProcedure [dbo].[_BasketPaging]    Script Date: 01/31/2014 12:09:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER Procedure [dbo].[_BasketPaging]
	@Key int, @KeyFunc int, @Search varchar(4000) = '', @StartRow int, @PageSize int
As
DECLARE @Sort varchar(100)

if (@Key = 1) -- Paging War
begin
	SET ROWCOUNT @StartRow
	SELECT @Sort = Name FROM spWar 
	WHERE isware=1 and bSusp=0 and Price > 0 and Ostat > 0 and r_hwar=@KeyFunc 
		and Name Like '%' + @Search + '%'
	ORDER BY Name

	SET ROWCOUNT @PageSize
	SELECT * FROM spWar 
	WHERE isware=1 and bSusp=0 and Price > 0 and Ostat > 0 and r_hwar=@KeyFunc 
		and Name Like '%' + @Search + '%'
		and Name >= @Sort
	ORDER BY Name
	
	SET ROWCOUNT 0
	return
end

if (@Key = 2) -- Paging Cli
begin
	SET ROWCOUNT @StartRow
	SELECT @Sort = Name FROM spCli 
	WHERE n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 and r_fcli is null 
		and Name Like '%' + @Search + '%'
	ORDER BY Name

	SET ROWCOUNT @PageSize
	SELECT * FROM spCli 
	WHERE n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 and r_fcli is null 
		and Name Like '%' + @Search + '%'
		and Name >= @Sort
	ORDER BY Name
	
	SET ROWCOUNT 0
	return
end

if (@Key = 3) -- Paging BilM
begin
	SET ROWCOUNT @StartRow
	SELECT @Sort = r_bil FROM Bil b Join spCLI c On c.r_cli=b.r_cli 
	WHERE b.N_TP=@KeyFunc and datediff(day, Datedoc, getdate())<20  
		and c.Name Like '%' + @Search + '%'
	ORDER BY r_bil desc

	SET ROWCOUNT @PageSize
	SELECT b.*, c.Name as cName, t.Name as tName, ISNULL(c.Name + ' - ' + t.Name, c.Name) as FullName, ISNULL(t.Adres, c.Adres) as AdresDost 
	FROM Bil b Join spCLI c On c.r_cli=b.r_cli Left Join spCLI t On t.r_cli=b.r_fcli
	WHERE b.N_TP=@KeyFunc and datediff(day, Datedoc, getdate())<20
	    and c.Name Like '%' + @Search + '%'
		and r_bil < @Sort
	ORDER BY r_bil desc

	SET ROWCOUNT 0
	return
end