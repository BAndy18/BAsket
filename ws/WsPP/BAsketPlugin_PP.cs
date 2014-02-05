using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using BAsketWS.DataAccess;
using BAsketWS.Models;

namespace BAsketPlugin_PP
{
	[PartMetadata("Name", "PP"), Export()]
	[Export(typeof(IBAsketPlugin))]
	public class BAsketPlugin_PP : IBAsketPlugin
	{
		//public const string SWUTable = "sy_WebUsers";
		//public const string SWarTable = "bas_spWar";
		//public const string SCliTable = "bas_spCli";

		public Dictionary<string, string> SqlCommands = new Dictionary<string, string>()
            {
		//*
                //{"WarsByGId", "Select * FROM (Select Row_Number() OVER (ORDER BY [name] ASC) as rowNum, * from spWar Where isware=1 and bSusp=0 and Price > 0 and r_hwar={0} {1})x Where rowNum > {2} and rowNum <= {2}+{3}"},
                {"WarsByGId", "exec _BasketPaging 1, {0}, '{1}', {2}, {3}"},
                {"WarById", "Select * From spWar Where r_war={0} "},
                {"War", "Select * From spWar Where isware=1 and bSusp=0 and Price > 0 and Ostat > 0 and r_hwar is not null and r_hwar not in (-182,18801,14967,15003) Order by Name"},
                {"WarGr", "Select * From spWar Where r_pwar=0 and r_war not in (-182,18801,14967,15003) Order by Name"},

                //{"Cli", "Select * FROM (Select Row_Number() OVER (ORDER BY [name] ASC) as rowNum, * from spCli Where n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 and r_fcli is null {0})x Where rowNum > {1} and rowNum <= {1}+{2} Order by Name"},
                {"Cli", "exec _BasketPaging 2, 0, '{0}', {1}, {2}"},
                {"CliFil", "Select * From spCli Where n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 and r_fcli={0} Order by Name"},
                {"CliById", "Select c.*, par.Name as ParName, ISNULL(par.Name + ' - ' + c.Name, c.Name) as FullName From spCli c Left Join spCLI par On c.r_fcli=par.r_cli Where c.r_cli={0}"},
                {"CliAll", "Select * From spCli Where n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 Order by Name"},

                //{"BilM", "Select b.*, c.Name as cName, t.Name as tName, ISNULL(c.Name + ' - ' + t.Name, c.Name) as FullName, ISNULL(t.Adres, c.Adres) as AdresDost From Bil b Join spCLI c On c.r_cli=b.r_cli Left Join spCLI t On t.r_cli=b.r_fcli Where b.N_TP={0} and datediff(day, Datedoc, getdate())<20 Order by DateDoc desc"},
                {"BilM", "exec _BasketPaging 3, {0}, '{1}', {2}, {3}"},
                {"BilMById", "Select b.*, c.Name as cName, t.Name as tName, ISNULL(c.Name + ' - ' + t.Name, c.Name) as FullName, ISNULL(t.Adres, c.Adres) as AdresDost From Bil b Join spCLI c On c.r_cli=b.r_cli Left Join spCLI t On t.r_cli=b.r_fcli Where r_bil={0}"},
                {"BilMSave", "exec _BasketStuff 1, '{0}', @Reply output"},

				{"Nms", "Select 0 as t_nms, 1 as n_nms, 'Предприятие' as Name Union " +
						"Select 0 as t_nms, 101 as n_nms, 'Отчет' as Name Union " +
						"Select 1 as t_nms, r_sup as n_nms, Name From spSUP Where Npp>0 Union " +
						"Select 101 as t_nms, fkey as n_nms, ltrim(rtrim(p.Name)) as Name From sy_PRN p Where bSusp=0 and NView<10 and NView>=0 and left(p.Name,2)<>'+ ' and left(p.Name,2)<>'--'   and p.fkey in (21,40, 78,79, 351, 454,455, 350) Union " +
						"Select t_nms, n_nms, Name From spNMS Where bSusp=0 and N_NMS in (2) and T_NMS=0 Union " +
						"Select t_nms, n_nms, Name From spNMS Where bSusp=0 and T_NMS in (2) " +
						"Order by t_nms, n_nms"},

		/*/
		// Нормаль данные
				{"WarsByGId", "Select * FROM (Select Row_Number() OVER (ORDER BY [N] ASC) as rowNum, * From " + SWarTable + " Where IdP='{0}' {1})x Where rowNum > {2} and rowNum <= {2}+{3}"},

				{"WarById", "Select * from " + SWarTable + " Where Id='{0}'"},
				{"War", "Select * from " + SWarTable + " Where isware=1 and len(N)>1 and O>0 Order by N"},

				{"WarGr", "Select * from " + SWarTable + " Where IdP=0"},

				{"Cli", "Select * FROM (Select Row_Number() OVER (ORDER BY [N] ASC) as rowNum, * From " +SCliTable+ " Where N is not null and A is not null and IdP is null {0})x Where rowNum > {1} and rowNum <= {1}+{2} Order by N"},
       
				{"CliFil", "Select * From " + SCliTable + " Where N is not null and A is not null and IdP='{0}' Order by N"},
                {"CliById", "Select c.*, par.N as PN, ISNULL(par.N + ' - ' + c.N, c.N) as FN From " + SCliTable + " c Left Join " + SCliTable + " par On c.IdP=par.Id Where c.Id='{0}'"},
				{"CliAll", "Select * From " + SCliTable + " Where N is not null and A is not null Order by N"},

				{"Nms", "Select 0 as IdP, 1 as Id, 'Предприятие' as N Union " +
						"Select 0 as IdP, 101 as Id, 'Отчет' as N Union " +
						"Select 1 as IdP, 1 as Id, 'Нормаль ООО' as N Union " +
						"Select 101 as IdP, 1 as Id, 'Отчет 1' as N " +
						"Order by IdP, Id"},

                {"BilMSave", "exec _BasketStuff 1, '{0}', @Reply output"},
		 /**/
				{"WebUsers", "Select * From spWar"},
			};


		//public MyTest2()
		//{
		//	creationDate = DateTime.Now;
		//}
		public string GetSqlCommand(string cmd)
		{
			return SqlCommands[cmd];
		}

		public List<Nms> ReadNms(DataReaderAdapter reader)
		{
			var result = new List<Nms>();
			while (reader.Read())
			{
				result.Add(new Nms()
				{
					IdP = reader.GetInt32("t_nms"),
					Id = reader.GetInt32("n_nms"),
					N = reader.GetString("Name"),
				});
			}
			return result;
		}

		public List<Category> ReadCategories(DataReaderAdapter reader)
		{
			var result = new List<Category>();
			while (reader.Read())
			{
				result.Add(new Category()
				{
					Id = reader.GetStrValue("r_war"),
					N = reader.GetStrValue("Name"),
				});
			}
			return result;
		}

		public List<Product> ReadProducts(DataReaderAdapter reader)
		{
			var result = new List<Product>();
			while (reader.Read())
			{
				result.Add(new Product()
				{
					Id = reader.GetStrValue("r_war"),
					IdP = reader.GetStrValue("r_hwar"),
					N = reader.GetStrValue("Name"),
                    N1 = reader.GetStrValue("Name_c"),
					N4 = reader.GetStrValue("NUPK"),
					O = reader.GetStrValue("Ostat"),
					P = reader.GetDecimal("Price"),
				});
			}
			return result;
		}

		public List<Client> ReadClient(DataReaderAdapter reader)
		{
			var result = new List<Client>();
			while (reader.Read())
			{
				result.Add(new Client()
				{
					Id = reader.GetStrValue("r_cli"),
					IdP = reader.GetStrValue("r_fcli"),
					N = reader.GetStrValue("Name"),
					A = reader.GetStrValue("Adres"),
				});
			}
			return result;
		}
	}

	//[PartMetadata("Name", "EmailSender2"), Export()]
	////[MessageMetadataAttribute("EmailSender2", "1.0.0.0")]
	//public class Plugs : IBAsketPlugin
	//{
	//	public string GetMessage()
	//	{
	//		return "-";
	//	}
	//	public string SqlCommand(string cmd)
	//	{
	//		return null;
	//	}
	//	[Export("StringTransformer")]
	//	public string UpperCase(string src)
	//	{
	//		return src.ToUpperInvariant();
	//	}

	//	[Export("StringTransformer")]
	//	public string LowerCase(string src)
	//	{
	//		return src.ToLowerInvariant();
	//	}
	//}

	//[PartMetadata("Name", "EmailSender3"), Export()]
	////[MessageMetadataAttribute("EmailSender3", "1.0.0.0")]
	//public class AnagramPlug : IBAsketPlugin
	//{
	//	public string GetMessage()
	//	{
	//		return "+";
	//	}
	//	public string SqlCommand(string cmd)
	//	{
	//		return "-";
	//	}
	//	[Export("StringTransformer")]
	//	public string MakeAnagram(string src)
	//	{
	//		var result = new StringBuilder();
	//		for (int i = src.Length - 1; i >= 0; --i)
	//			result.Append(src[i]);
	//		return result.ToString();
	//	}
	//}
}
