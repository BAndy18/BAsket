USE [DBPetra]
GO
/****** Object:  StoredProcedure [dbo].[_BasketStuff]    Script Date: 01/31/2014 12:09:59 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER Procedure [dbo].[_BasketStuff]
	@Key int, @Param varchar(4000) = '', @Reply varchar(100)  OUTPUT 
As
DECLARE @i int, @id int, @start int, @token varchar(4000), @NumDoc varchar(4000), 
	@P1 varchar(100), @P2 varchar(100), @P3 varchar(100), @P4 varchar(100), @P5 varchar(100), @P6 varchar(100), @P7 varchar(100), @P8 varchar(100),
	@I1 int, @D1 money

if (@Key = 1) -- BilM Save
begin
	set @i = 0
	while CHARINDEX('|', @Param) > 0
	begin
		set @i = @i + 1
		SELECT @start = CHARINDEX('|', @Param)
		SELECT @token = SUBSTRING(@Param, 0, @start)
		SELECT @Param = SUBSTRING(@Param, @start + 1, len(@Param) - @start)
		if @i = 1 set @P1 = @token else
		if @i = 2 set @P2 = @token else
		if @i = 3 set @P3 = @token else
		if @i = 4 set @P4 = @token else
		if @i = 5 set @P5 = @token else
		if @i = 6 set @P6 = @token else
		if @i = 7 set @P7 = @token else
		if @i = 8 set @P8 = @token 
	end
	if len(@P7) = 0 --ID
	begin
		if len(@P1) = 0 
			Select @P1 = [Vint] From sy_PRMs Where [Name_c]='DEF_SUP'
		if @P4 = '0'
			set @P4 = null
		
		exec _GetNextAutoNumber 'Bil.NumDoc', @P1, @NumDoc output

		Insert Bil(r_sup,r_cli,r_fcli, DateDoc,Note,NumDoc, N_TP, Discont,N_DAYS)
		Select @P1,@P3,@P4, CONVERT(DateTime, @P2, 105),@P5,@NumDoc, @P6, c.Discont,c.cN_DAYS 
		From spCli c Where r_cli=@P3
					
		Select @id = @@IDENTITY
	end else begin
		set @id = @P7
		Select @I1 = r_stad, @D1 = SumInv From Bil Where r_bil=@id
		if @I1 > 50 or @D1 > 0 
		begin
			set @Reply = 'корректировка отменена, счет только для чтения'
			return
		end
		
		Update Bil set r_cli=@P3, r_fcli=@P4, DateDoc=CONVERT(DateTime, @P2, 105), Note=@P5
		Where r_bil=@id
		Delete Bils Where r_bil=@id
	end
	
	while CHARINDEX(';', @P8) > 0
	begin
		SELECT @start = CHARINDEX(';', @P8)
		SELECT @token = SUBSTRING(@P8, 0, @start)
		SELECT @P8 = SUBSTRING(@P8, @start + 1, len(@P8) - @start)
		
		SELECT @start = CHARINDEX(':', @token)
		set @P1 = SUBSTRING(@token, 0, @start)
		set @P2 = SUBSTRING(@token, @start + 1, len(@token) - @start)
		
		Insert Bils(r_bil,r_war,quant, price, NDS, N_UNI)
		Select @id,@P1,@P2, Price, NDS, N_UNI
		From spWar Where r_war=@P1
	end
	
	exec BilRenumber @id
	exec BilChangeDisc @id, 101
	exec [BilInsWhsAuto] @id, @Reply output
	
	return
end

if (@Key = 2) -- 
begin
	return
end

