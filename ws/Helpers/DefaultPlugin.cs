using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Xml;
using System.Xml.Serialization;
using BAsketWS.DataAccess;
using BAsketWS.Models;

namespace BAsketWS.Helpers
{
	//[PartMetadata("Name", "PluginName"), Export()]
	//[Export(typeof(IBAsketPlugin))]
	public class DefaultPlugin : IBAsketPlugin
	{
		#region Const

		const string SProdTable = "bas_spProducts";
		const string SCliTable = "bas_spClients";
		const string SwuTable = "bas_WebUsers";
		const string SBilTable = "bas_BilDocs";
		const string SBasketProc = "bas_BAsketStuff";

		const string SqlGetCategories = "Select * from " + Common.SProdTable + " Where IdP=0";
		const string SqlGetNms = "Select 0 as IdP, 1 as Id, 'Предприятие' as N Union " +
						"Select 0 as IdP, 101 as Id, 'Отчет' as N Union " +
						"Select 1 as IdP, 1 as Id, 'Нормаль ООО' as N Union " +
						"Select 101 as IdP, 1 as Id, 'Отчет 1' as N " +
						"Order by IdP, Id";

		const string SqlGetAllProducts =
			"Select * from " + Common.SProdTable + " Where isWare=1 and len(N)>1 and O>0 Order by N";
		const string SqlGetProductById = "Select * from " + Common.SProdTable + " Where Id='{0}'";
		const string SqlGetProductsByPId =
			"Select * FROM (Select Row_Number() OVER (ORDER BY [N] ASC) as rowNum, * From " + Common.SProdTable +
			" Where IdP='{0}' {1})x Where rowNum > {2} and rowNum <= {2}+{3}";

		const string SqlGetClients =
			"Select * FROM (Select Row_Number() OVER (ORDER BY [N] ASC) as rowNum, * From " + Common.SCliTable +
			" Where N is not null and A is not null and IdP is null {0})x Where rowNum > {1} and rowNum <= {1}+{2} Order by N";
		const string SqlGetClientsByPId =
			"Select * From " + Common.SCliTable + " Where N is not null and A is not null and IdP='{0}' Order by N";
		const string SqlGetClientById =
			"Select c.*, par.N as PN, ISNULL(par.N + ' - ' + c.N, c.N) as FN From " + Common.SCliTable + " c Left Join " +
			Common.SCliTable + " par On c.IdP=par.Id Where c.Id='{0}'";
		const string SqlGetAllClients =
			"Select * From " + Common.SCliTable + " Where N is not null and A is not null Order by N";

		const string SqlGetBilM =
			"Select * FROM (Select Row_Number() OVER (ORDER BY [N] ASC) as rowNum, b.*, c.N From " + Common.SBilTable + " b Join " +
			Common.SCliTable + " c On c.Id=b.IdC " +
			" Where IdUser='{0}' {1})x Where rowNum > {2} and rowNum <= {2}+{3}";
		const string SqlGetBilMById =
			"Select b.*, c.N as cN, t.N as tN, ISNULL(c.N + ' - ' + t.N, c.N) as FN, ISNULL(t.A, c.A) as AD From " +
			Common.SBilTable + " b Join " + Common.SCliTable + " c On c.Id=b.IdC Left Join " + Common.SCliTable +
			" t On t.Id=b.IdT Where b.Id={0}";
		const string SqlExecBilMSave = "exec " + Common.SBasketProc + " 1, '{0}', @Reply output";

		const string SqlGetWebUsers = "Select * From " + Common.SwuTable;

		const string SqlExecUpdStock0 = "Update " + Common.SProdTable + " set O=0";
		const string SqlExecUpdUpdateProd = "Update " + Common.SProdTable + " set O=0";
		const string SqlExecUpdInsertProd = "Insert Into " + Common.SProdTable + " (Id,IdP,N,N1,N2,N3,N4,O,P,isWare) Values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}',{9})";

		#endregion

		#region Category & Nms Controllers

		public List<Nms> GetNms()
		{
			var result = Common.ProcessCommand(SqlGetNms, reader => new Nms
			{
				IdP = reader.GetInt32("IdP"),
				Id = reader.GetInt32("Id"),
				N = reader.GetStrValue("N"),
			});
			return result;
		}

		public List<Category> GetCategories()
		{
			var result = Common.ProcessCommand(SqlGetCategories, reader => new Category
			{
				Id = reader.GetStrValue("Id"),
				N = reader.GetStrValue("N"),
			});
			//XmlHelper.XmlOut(result);

			return result;
		}
		#endregion

		#region Client Controller

		static List<Client> ProcessClients(string cmd)
		{
			return Common.ProcessCommand(cmd, reader => new Client
			{
				Id = reader.GetStrValue("Id"),
				IdP = reader.GetStrValue("IdP"),
				N = reader.GetStrValue("N"),
				A = reader.GetStrValue("A"),
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

		#region Product & Ostat Controllers

		static List<Product> ProcessProducts(string cmd)
		{
			return Common.ProcessCommand(cmd, reader => new Product
			{
				Id = reader.GetStrValue("Id"),
				IdP = reader.GetStrValue("IdP"),
				N = reader.GetStrValue("N"),
				N1 = reader.GetStrValue("N1"), //NameArt
				N2 = reader.GetStrValue("N2"), //NameManuf
				N3 = reader.GetStrValue("N3"), //UrlPict - Name_pict
				N4 = reader.GetStrValue("N4"), //Upak 
				O = reader.GetStrValue("O"),
				P = reader.GetDecimal("P"),
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
				Id = reader.GetStrValue("Id"),
				O = reader.GetStrValue("O"),
			});
			return result;
		}
		
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

		#region UpdateDBFromSwapFile

		public void UpdateDbFromSwapFile()
		{
			Common.SaveLog("DefaultPlugin.UpdateDbFromSwapFile");

			var cmd = "";
			XmlHelper.BAsketSwap doc;
			var ser = XmlSerializer.FromTypes(new[] { typeof(XmlHelper.BAsketSwap) })[0];
			using (var reader = XmlReader.Create(Common.StockFileName))
			{
				doc = (XmlHelper.BAsketSwap)ser.Deserialize(reader);
			}
			if (doc == null)
				return;

			var tran = BaseRepository.BeginTransaction();
			
			try
			{
				BaseRepository.ExecuteTransactionalCommand(tran, SqlExecUpdStock0, null);

				foreach (var p in doc.Products.FProd)
				{
					BaseRepository.ExecuteTransactionalCommand(tran, SqlExecUpdStock0, null);
					cmd = string.Format(SqlGetProductById, p.Id);
					//var reader = BaseRepository.ExecuteReaderTransactional(tran, cmd, null);
					//if (reader.Read())
					//{
					//	// try update
					//	//grpNames[val] = reader.GetString("r_war").ToString();
					//}
					//else
					{	// insert
						//"Insert Into " + Common.SProdTable + " (Id,IdP,N,N1,N2,N3,N4,O,P,isWare) Values('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}',{0})";
						cmd = string.Format(SqlExecUpdInsertProd, p.Id, p.IdP, p.Name, p.Name1, p.Name2, p.Name3, p.Name4,
							p.Stock, p.Price, string.IsNullOrEmpty(p.IdP) ? 0 : 1);
						BaseRepository.ExecuteTransactionalCommand(tran, cmd, null);
					}
				}

				BaseRepository.CommitTransaction(tran);
			}
			catch (Exception ex)
			{
				// Handle the exception if the transaction fails to commit.
				Common.SaveLog(ex.Message);

				//try
				//{
				//	// Attempt to roll back the transaction.
				//	tran.Rollback();
				//}
				//catch (Exception exRollback)
				//{
				//	// Throws an InvalidOperationException if the connection 
				//	// is closed or the transaction has already been rolled 
				//	// back on the server.
				//	Common.SaveLog(exRollback.Message);
				//}
			}
		}

		#endregion

	}
}

//static public Dictionary<string, string> SqlCommands = new Dictionary<string, string>()
//	{
/// *
//		//{"WarsByGId", "Select * FROM (Select Row_Number() OVER (ORDER BY [name] ASC) as rowNum, * from spWar Where isware=1 and bSusp=0 and Price > 0 and r_hwar={0} {1})x Where rowNum > {2} and rowNum <= {2}+{3}"},
//		{"WarsByGId", "exec _BasketPaging 1, {0}, {1}, {2}, {3}"},
//		{"WarById", "Select * From spWar Where r_war={0} "},
//		{"War", "Select * From spWar Where isware=1 and bSusp=0 and Price > 0 and Ostat > 0 and r_hwar is not null and r_hwar not in (-182,18801,14967,15003) Order by Name"},
//		{"WarGr", "Select * From spWar Where r_pwar=0 and r_war not in (-182,18801,14967,15003) Order by Name"},

//		//{"Cli", "Select * FROM (Select Row_Number() OVER (ORDER BY [name] ASC) as rowNum, * from spCli Where n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 and r_fcli is null {0})x Where rowNum > {1} and rowNum <= {1}+{2} Order by Name"},
//		{"Cli", "exec _BasketPaging 2, 0, {0}, {1}, {2}"},
//		{"CliFil", "Select * From spCli Where n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 and r_fcli={0} Order by Name"},
//		{"CliById", "Select c.*, par.Name as ParName, ISNULL(par.Name + ' - ' + c.Name, c.Name) as FullName From spCli c Left Join spCLI par On c.r_fcli=par.r_cli Where c.r_cli={0}"},
//		{"CliAll", "Select * From spCli Where n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 Order by Name"},

//		//{"BilM", "Select b.*, c.Name as cName, t.Name as tName, ISNULL(c.Name + ' - ' + t.Name, c.Name) as FullName, ISNULL(t.Adres, c.Adres) as AdresDost From Bil b Join spCLI c On c.r_cli=b.r_cli Left Join spCLI t On t.r_cli=b.r_fcli Where b.N_TP={0} and datediff(day, Datedoc, getdate())<20 Order by DateDoc desc"},
//		{"BilM", "exec _BasketPaging 3, {0}, {1}, {2}, {3}"},
//		{"BilMById", "Select b.*, c.Name as cName, t.Name as tName, ISNULL(c.Name + ' - ' + t.Name, c.Name) as FullName, ISNULL(t.Adres, c.Adres) as AdresDost From Bil b Join spCLI c On c.r_cli=b.r_cli Left Join spCLI t On t.r_cli=b.r_fcli Where r_bil={0}"},
//		{"BilMSave", "exec _BasketStuff 1, '{0}', @Reply output"},


/// * /
//// Нормаль данные
//		{"WarsByGId", "Select * FROM (Select Row_Number() OVER (ORDER BY [N] ASC) as rowNum, * From " + SWarTable + " Where IdP='{0}' {1})x Where rowNum > {2} and rowNum <= {2}+{3}"},

//		{"WarById", "Select * from " + SWarTable + " Where Id='{0}'"},
//		{"War", "Select * from " + SWarTable + " Where isware=1 and len(N)>1 and O>0 Order by N"},

//		{"WarGr", "Select * from " + SWarTable + " Where IdP=0"},

//		{"Cli", "Select * FROM (Select Row_Number() OVER (ORDER BY [N] ASC) as rowNum, * From " +SCliTable+ " Where N is not null and A is not null and IdP is null {0})x Where rowNum > {1} and rowNum <= {1}+{2} Order by N"},
/// * * /
//		{"CliFil", "Select * From " + SCliTable + " Where N is not null and A is not null and IdP='{0}' Order by N"},
//		{"CliById", "Select c.*, par.N as PN, ISNULL(par.N + ' - ' + c.N, c.N) as FN From " + SCliTable + " c Left Join " + SCliTable + " par On c.IdP=par.Id Where c.Id='{0}'"},
//		{"CliAll", "Select * From " + SCliTable + " Where N is not null and A is not null Order by N"},

//		{"Nms", "Select 0 as IdP, 1 as Id, 'Предприятие' as N Union " +
//				"Select 0 as IdP, 101 as Id, 'Отчет' as N Union " +
//				"Select 1 as IdP, 1 as Id, 'Нормаль ООО' as N Union " +
//				"Select 101 as IdP, 1 as Id, 'Отчет 1' as N " +
//				"Order by IdP, Id"},

//		{"BilMSave", "exec _BasketStuff 1, '{0}', @Reply output"},

//		{"WebUsers", "Select * From " + SwuTable},
//	};


//public string GetSqlCommand(string cmd)
//{
//	return SqlCommands[cmd];
//}
