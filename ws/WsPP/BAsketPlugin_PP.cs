using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Data;
using System.Web;
using BAsketWS.DataAccess;
using BAsketWS.Helpers;
using BAsketWS.Models;

namespace BAsketPlugin_PP
{
	[PartMetadata("Name", "PP"), Export()]
	[Export(typeof(IBAsketPlugin))]
	public class BAsketPlugin_PP : IBAsketPlugin
	{
		#region Const

		const string SqlGetCategories = "Select * From spWar Where r_pwar=0 and r_war not in (-182,18801,14967,15003) Order by Name";
		const string SqlGetNms = "Select 0 as t_nms, 1 as n_nms, 'Предприятие' as Name Union " +
						"Select 0 as t_nms, 101 as n_nms, 'Отчет' as Name Union " +
						"Select 1 as t_nms, r_sup as n_nms, Name From spSUP Where Npp>0 Union " +
						"Select 101 as t_nms, fkey as n_nms, ltrim(rtrim(p.Name)) as Name From sy_PRN p Where bSusp=0 and NView<10 and NView>=0 and left(p.Name,2)<>'+ ' and left(p.Name,2)<>'--'   and p.fkey in (21,40, 78,79, 351, 454,455, 350) Union " +
						"Select t_nms, n_nms, Name From spNMS Where bSusp=0 and N_NMS in (2) and T_NMS=0 Union " +
						"Select t_nms, n_nms, Name From spNMS Where bSusp=0 and T_NMS in (2) " +
						"Order by t_nms, n_nms";

		const string SqlGetAllProducts = "Select * From spWar Where isware=1 and bSusp=0 and Price > 0 and Ostat > 0 and r_hwar is not null and r_hwar not in (-182,18801,14967,15003) Order by Name";
		const string SqlGetProductsByPId = "exec _BasketPaging 1, {0}, '{1}', {2}, {3}";
		const string SqlGetProductById = "Select * From spWar Where r_war={0}";

		const string SqlGetClients = "exec _BasketPaging 2, 0, '{0}', {1}, {2}";
		const string SqlGetClientsByPId = "Select * From spCli Where n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 and r_fcli={0} Order by Name";
		const string SqlGetClientById = "Select c.*, par.Name as ParName, ISNULL(par.Name + ' - ' + c.Name, c.Name) as FullName From spCli c Left Join spCLI par On c.r_fcli=par.r_cli Where c.r_cli={0}";
		const string SqlGetAllClients = "Select * From spCli Where n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 Order by Name";

		const string SqlGetBilM = "exec _BasketPaging 3, {0}, '{1}', {2}, {3}";
		const string SqlGetBilMById = "Select b.*, c.Name as cName, t.Name as tName, ISNULL(c.Name + ' - ' + t.Name, c.Name) as FullName, ISNULL(t.Adres, c.Adres) as AdresDost From Bil b Join spCLI c On c.r_cli=b.r_cli Left Join spCLI t On t.r_cli=b.r_fcli Where r_bil={0}";
		const string SqlExecBilMSave = "exec _BasketStuff 1, '{0}', @Reply output";
		
		const string SqlGetWebUsers = "Select * From sy_WebUsers";
		#endregion

		#region Category & Nms

		public List<Nms> GetNms()
		{
			var result = Common.ProcessCommand(SqlGetNms, reader => new Nms
			{
				IdP = reader.GetInt32("t_nms"),
				Id = reader.GetInt32("n_nms"),
				N = reader.GetString("Name"),
			});
			return result;
		}

		public List<Category> GetCategories()
		{
			var result = Common.ProcessCommand(SqlGetCategories, reader => new Category
			{
				Id = reader.GetStrValue("r_war"),
				N = reader.GetStrValue("Name"),
			});
			//XmlHelper.XmlOut(result);
			return result;
		}
		#endregion

		#region Clients

		static List<Client> ProcessClients(string cmd)
		{
			return Common.ProcessCommand(cmd, reader => new Client
			{
				Id = reader.GetStrValue("r_cli"),
				IdP = reader.GetStrValue("r_fcli"),
				N = reader.GetStrValue("Name"),
				A = reader.GetStrValue("Adres"),
			});
		}
		public List<Client> GetClients()
		{
			var qs = HttpContext.Current.Request.QueryString;
			var id = qs["pId"];
			var top = int.Parse(qs["take"] ?? "30");
			var skip = int.Parse(qs["skip"] ?? "0");
			var searchString = qs["searchString"] ?? "";
			var cmd = (id == "all")
				? SqlGetAllClients
				: string.Format(SqlGetClients, searchString, skip, top);

			var result = ProcessClients(cmd);
			return result;
		}

		public List<Client> GetClientsById(string id)
		{
			var qs = HttpContext.Current.Request.QueryString;
			var fil = qs["fil"];
			var cmd = (fil == null)
				? string.Format(SqlGetClientById, id)
				: string.Format(SqlGetClientsByPId, id);

			var result = ProcessClients(cmd);
			return result;
		}
		#endregion

		#region Product & Ostat

		static List<Product> ProcessProducts(string cmd)
		{
			return Common.ProcessCommand(cmd, reader => new Product
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

		public List<Product> GetProducts()
		{
			var qs = HttpContext.Current.Request.QueryString;
			var id = qs["pId"];
			var top = qs["take"] ?? "30";
			var skip = qs["skip"] ?? "0";
			var searchString = qs["searchString"] ?? "";

			var cmd = (id == "all" || id == "ost") ?
				SqlGetAllProducts :
				string.Format(SqlGetProductsByPId,
					id, searchString, skip, top);

			var result = ProcessProducts(cmd);
			XmlHelper.XmlOut(result);

			return result;
		}

		public Product GetProductById(string id)
		{
			var cmd = string.Format(SqlGetProductById, id);
			var result = ProcessProducts(cmd);
			return result[0];
		}

		public List<ProdStock> GetProdStock()
		{
			var result = Common.ProcessCommand(SqlGetAllProducts, reader => new ProdStock
			{
				Id = reader.GetStrValue("r_war"),
				O = reader.GetStrValue("Ostat"),
			});
			return result;
		}

		//public List<Product> ReadProducts(DataReaderAdapter reader)
		//{
		//	var result = new List<Product>();
		//	while (reader.Read())
		//	{
		//		result.Add(new Product()
		//		{
		//			Id = reader.GetStrValue("r_war"),
		//			IdP = reader.GetStrValue("r_hwar"),
		//			N = reader.GetStrValue("Name"),
		//			N1 = reader.GetStrValue("Name_c"),
		//			N4 = reader.GetStrValue("NUPK"),
		//			O = reader.GetStrValue("Ostat"),
		//			P = reader.GetDecimal("Price"),
		//		});
		//	}
		//	return result;
		//}
		#endregion

		#region BilM Controller

		static List<BilM> ProcessBilM(string cmd)
		{
			return Common.ProcessCommand(cmd, reader => new BilM
			{
				Id = reader.GetStrValue("r_bil"),
				IdCli = reader.GetStrValue("r_cli"),
				IdTp = reader.GetStrValue("r_fcli"),
				DateDoc = reader.GetStrValue("DateDoc"),
				SumDoc = reader.GetDecimal("SumDoc").ToString("N2"),
				sNote = reader.GetStrValue("Note"),
				cName = reader.GetStrValue("cName"),
				tName = reader.GetStrValue("tName"),
				FullName = reader.GetStrValue("FullName"),
				AdresDost = reader.GetStrValue("AdresDost"),
			});
		}

		public List<BilM> GetBilM()
		{
			var qs = HttpContext.Current.Request.QueryString;
			var id = qs["pId"];
			var top = qs["take"] ?? "30";
			var skip = qs["skip"] ?? "0";
			var searchString = qs["searchString"] ?? "";

			var user = HttpContext.Current.User.Identity.Name;
			var userTp = "-1";
			if (user.Split(';').Length > 1)
			{
				userTp = user.Split(';')[1];
			}
			else
			{
				//return new List<BilM> { new BilM() { sNote = "user not found " + user } };
			}
			var cmd = string.Format(SqlGetBilM, userTp, searchString, skip + 1, top);

			var result = ProcessBilM(cmd);
			return result;
		}

		public BilM GetBilMById(string id)
		{
			var cmd = string.Format(SqlGetBilMById, id);
			var result = ProcessBilM(cmd);
			return result[0];
		}

		public BilM PostBilM()
		{
			var retvalue = "";
			var user = HttpContext.Current.User.Identity.Name;
			var userTp = "-1";
			if (user.Split(';').Length > 1)
			{
				userTp = user.Split(';')[1];
			}
			else
			{
				//return new BilM() { sNote = "user not found " + user };
			}
			var form = HttpContext.Current.Request.Form;
			var comand = form["cmd"];
			if (comand == "SaveBil")
			{
				var vOther = form["sOther"].Split(';');
				var sup = (vOther.Length > 0 && vOther[0].Length > 0) ? vOther[0].Split(':')[1] : "";

				//			var sParam = string.Format("id={0};date={1};idCli={2};idTp={3};sOther={4};sWars={5};sNote={6};", 
				//                form["id"], form["date"], form["idCli"], form["idTp"], form["sOther"], form["sWars"], form["sNote"], user.Split(';')[1]);
				var idServ = form["idServ"];
				var sParam = string.Format("{0}|{1}|{2}|{3}|{4}|{5}|{6}|{7};|",
					sup, form["date"], form["idCli"], form["idTp"], form["sNote"], userTp, idServ, form["sWars"]);

				var cmd = string.Format(SqlExecBilMSave, sParam);
				var prm = BaseRepository.NewParamList(BaseRepository.NewParam("@Reply", "", ParameterDirection.Output, 100));

				retvalue = BaseRepository.ExecuteScalar(cmd, prm).ToString();
			}
			else if (comand == "SendRepo")
			{
				RepoHelper.RepoPrint(form["id"], form["mail"]);
			}

			return new BilM() { sNote = retvalue };
		}

		#endregion

		public void UpdateDbFromSwapFile()
		{
		}
	}
}
//public const string SWUTable = "sy_WebUsers";
//public const string SWarTable = "bas_spWar";
//public const string SCliTable = "bas_spCli";

//public Dictionary<string, string> SqlCommands = new Dictionary<string, string>()
//	{
////*
//		//{"WarsByGId", "Select * FROM (Select Row_Number() OVER (ORDER BY [name] ASC) as rowNum, * from spWar Where isware=1 and bSusp=0 and Price > 0 and r_hwar={0} {1})x Where rowNum > {2} and rowNum <= {2}+{3}"},
//		{"WarsByGId", "exec _BasketPaging 1, {0}, '{1}', {2}, {3}"},
//		{"WarById", "Select * From spWar Where r_war={0} "},
//		{"War", "Select * From spWar Where isware=1 and bSusp=0 and Price > 0 and Ostat > 0 and r_hwar is not null and r_hwar not in (-182,18801,14967,15003) Order by Name"},
//		{"WarGr", "Select * From spWar Where r_pwar=0 and r_war not in (-182,18801,14967,15003) Order by Name"},

//		//{"Cli", "Select * FROM (Select Row_Number() OVER (ORDER BY [name] ASC) as rowNum, * from spCli Where n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 and r_fcli is null {0})x Where rowNum > {1} and rowNum <= {1}+{2} Order by Name"},
//		{"Cli", "exec _BasketPaging 2, 0, '{0}', {1}, {2}"},
//		{"CliFil", "Select * From spCli Where n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 and r_fcli={0} Order by Name"},
//		{"CliById", "Select c.*, par.Name as ParName, ISNULL(par.Name + ' - ' + c.Name, c.Name) as FullName From spCli c Left Join spCLI par On c.r_fcli=par.r_cli Where c.r_cli={0}"},
//		{"CliAll", "Select * From spCli Where n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 Order by Name"},

//		//{"BilM", "Select b.*, c.Name as cName, t.Name as tName, ISNULL(c.Name + ' - ' + t.Name, c.Name) as FullName, ISNULL(t.Adres, c.Adres) as AdresDost From Bil b Join spCLI c On c.r_cli=b.r_cli Left Join spCLI t On t.r_cli=b.r_fcli Where b.N_TP={0} and datediff(day, Datedoc, getdate())<20 Order by DateDoc desc"},
//		{"BilM", "exec _BasketPaging 3, {0}, '{1}', {2}, {3}"},
//		{"BilMById", "Select b.*, c.Name as cName, t.Name as tName, ISNULL(c.Name + ' - ' + t.Name, c.Name) as FullName, ISNULL(t.Adres, c.Adres) as AdresDost From Bil b Join spCLI c On c.r_cli=b.r_cli Left Join spCLI t On t.r_cli=b.r_fcli Where r_bil={0}"},
//		{"BilMSave", "exec _BasketStuff 1, '{0}', @Reply output"},

//		{"Nms", "Select 0 as t_nms, 1 as n_nms, 'Предприятие' as Name Union " +
//				"Select 0 as t_nms, 101 as n_nms, 'Отчет' as Name Union " +
//				"Select 1 as t_nms, r_sup as n_nms, Name From spSUP Where Npp>0 Union " +
//				"Select 101 as t_nms, fkey as n_nms, ltrim(rtrim(p.Name)) as Name From sy_PRN p Where bSusp=0 and NView<10 and NView>=0 and left(p.Name,2)<>'+ ' and left(p.Name,2)<>'--'   and p.fkey in (21,40, 78,79, 351, 454,455, 350) Union " +
//				"Select t_nms, n_nms, Name From spNMS Where bSusp=0 and N_NMS in (2) and T_NMS=0 Union " +
//				"Select t_nms, n_nms, Name From spNMS Where bSusp=0 and T_NMS in (2) " +
//				"Order by t_nms, n_nms"},

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
//	{"WebUsers", "Select * From spWar"},
//};


//public MyTest2()
//{
//	creationDate = DateTime.Now;
//}
