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
		const string SqlGetNms = "Select * From " + Common.SNmsTable + " Order By IdP,Id";
			//"Select 0 as IdP, 1 as Id, N'Предприятие' as N Union " +
			//"Select 0 as IdP, 101 as Id, N'Отчет' as N Union " +
			//"Select 1 as IdP, 1 as Id, N'BAsket ООО' as N Union " +
			//"Select 101 as IdP, 1 as Id, N'Отчет 1' as N " +
			//"Order by IdP, Id";

		const string SqlGetAllProducts =
			"Select * from " + Common.SProdTable + " Where isWare=1 and len(N)>1 and O>0 Order by N";
		const string SqlGetProductById = "Select * From " + Common.SProdTable + " Where Id In ('{0}')";
		const string SqlGetProductsByPId =
			"Select * FROM (Select Row_Number() OVER (ORDER BY [N] ASC) as rowNum, * From " + Common.SProdTable +
			" Where IdP='{0}' {1})x Where O>0 and rowNum > {2} and rowNum <= {2}+{3}";

		const string SqlGetClients =
			"Select * FROM (Select Row_Number() OVER (ORDER BY [N] ASC) as rowNum, * From " + Common.SCliTable +
			" Where (IdP='' or IdP is null) {0})x Where rowNum > {1} and rowNum <= {1}+{2} Order by N";
		const string SqlGetClientsByPId =
			"Select * From " + Common.SCliTable + " Where IdP='{0}' Order by N";
		const string SqlGetClientById =
			"Select c.Id,c.IdP,c.N,c.A, par.N as N1, ISNULL(par.N + ' - ' + c.N, c.N) as N2 From " + Common.SCliTable +
			" c Left Join " + Common.SCliTable + " par On c.IdP=par.Id Where c.Id='{0}'";
		const string SqlGetAllClients =
			"Select * From " + Common.SCliTable + " Where 1=1 Order by N";

		const string SqlGetBil =
			"Select * FROM (Select Row_Number() OVER (ORDER BY b.Id desc, c.N ASC) as rowNum, b.*, " +
			"ISNULL(c.N + ' - ' + t.N, c.N) as N1, ISNULL(t.A, c.A) as N2  From " + Common.SBilTable + 
			" b Join " + Common.SCliTable + " c On c.Id=b.IdC Left Join " + Common.SCliTable + " t On t.Id=b.IdT " +
			" Where IdUser='{0}' {1})x Where rowNum > {2} and rowNum <= {2}+{3}";
		const string SqlGetBilById =
			"Select b.*, c.N as N1, t.N as N2, ISNULL(c.N + ' - ' + t.N, c.N) as FN, ISNULL(t.A, c.A) as AD From " +
			Common.SBilTable + " b Join " + Common.SCliTable + " c On c.Id=b.IdC Left Join " + Common.SCliTable +
			" t On t.Id=b.IdT Where b.Id={0}";
		const string SqlExecBilSave = "exec " + Common.SBasketProc + " 1, N'{0}', @Reply output";
		const string SqlDelBilSave = "Delete " + Common.SBilTable + " Where Id='{0}'";

		const string SqlGetRoadMap =
			"Select * FROM (Select Row_Number() OVER (ORDER BY DateRM, b.Npp) as rowNum, b.*, " +
			"ISNULL(c.N + ' - ' + t.N, c.N) as N1, ISNULL(t.A, c.A) as N2, ISNULL(t.Id, c.Id) as N3 From " +
			Common.SRoadTable + " b Join " + Common.SCliTable + " c On c.Id=b.IdC Left Join " + Common.SCliTable + " t On t.Id=b.IdT " +
			" Where IdUser='{0}' and DateRM{1} {2})x Where rowNum > {3} and rowNum <= {3}+{4}";
		const string SqlDeleteRoadMap = "Delete From " + Common.SRoadTable + " Where IdUser='{0}' and DateRM>=getdate()";
		const string SqlInsertRoadMap = 
			//"If Exists(Select Id From " + Common.SRoadTable + " Where IdUser='{0}' and DateRec='{1}') Delete From " + 
			//Common.SRoadTable + " Where IdUser='{0}' and DateRec='{1}';" +
			"Insert Into " + Common.SRoadTable + " (IdUser,DateRM,Npp,IdC,IdT) Values({0},'{1}',{2},'{3}',{4})";
		const string SqlUpdateRoadMapIdB = "Update " + Common.SRoadTable + " set IdB={0} Where Id={1}";

		const string SqlExecUpdStock0 = "Update " + Common.SProdTable + " set O=0";
		const string SqlExecUpdInsProd =
			"If Exists(Select Id From " + Common.SProdTable + " Where Id='{0}') Update " + Common.SProdTable +
			" set IdP='{1}',N='{2}',N1={3},N2={4},N3={5},N4={6}, O={7},P={8},isWare={9} Where Id='{0}' Else Insert Into " +
			Common.SProdTable + " (Id,IdP,N,N1,N2,N3,N4,O,P,isWare) Values('{0}','{1}','{2}',{3},{4},{5},{6}, {7},{8},{9})";
		const string SqlExecUpdInsCli =
			"If Exists(Select Id From " + Common.SCliTable + " Where Id='{0}') Update " + Common.SCliTable +
			" set IdP='{1}',N='{2}',N1={3},A='{4}' Where Id='{0}' Else Insert Into " +
			Common.SCliTable + " (Id,IdP,N,N1,A) Values('{0}','{1}','{2}',{3},'{4}')";

		const string SqlGetWebUsers = "Select * From " + Common.SwuTable;
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
				N1 = reader.GetStrValue("N1"),
				N2 = reader.GetStrValue("N2"),
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
			if (!string.IsNullOrEmpty(searchString))
				searchString = string.Format(" and (N Like '%{0}%') ", searchString);

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
			var wstr = qs["w"];
			var top = qs["take"] ?? "30";
			var skip = qs["skip"] ?? "0";
			var searchString = qs["searchString"] ?? "";
			if (!string.IsNullOrEmpty(searchString))
	            searchString = string.Format(" and (N Like '%{0}%') ", searchString);

			var cmd = (id == "all" || id == "ost") 
				? SqlGetAllProducts 
				: string.Format(SqlGetProductsByPId, id, searchString, skip, top);
			if (!string.IsNullOrEmpty(wstr))
			{
				var wPrm = "";
				foreach (var w in wstr.Split(';'))
				{
					var wV = w.Split(':');
					if (wV.Length == 2)
						wPrm += string.Format("'{0}',", wV[0]);
				}
				if (wPrm.Length < 4)
					return new List<Product>();
				else
					wPrm = wPrm.Substring(1, wPrm.Length - 3);
				cmd = string.Format(SqlGetProductById, wPrm);
			}

			var result = ProcessProducts(cmd);

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

		#region Bil Controller

		static List<Bil> ProcessBil(string cmd)
		{
			return Common.ProcessCommand(cmd, reader => new Bil
			{
				Id = reader.GetStrValue("Id"),
				IdC = reader.GetStrValue("IdC"),
				IdT = reader.GetStrValue("IdT"),
				IdUser = reader.GetStrValue("IdUser"),
				NumDoc = reader.GetStrValue("NumDoc"),
				DateDoc = reader.GetStrValue("DateDoc"),
				SumDoc = reader.GetDecimal("SumDoc").ToString("N2"),
				Note = reader.GetStrValue("Note"),
				Wars = reader.GetStrValue("Wars"),
				N1 = reader.GetStrValue("N1"),
				N2 = reader.GetStrValue("N2"),
				P1 = reader.GetStrValue("P1"),
				P2 = reader.GetStrValue("P2"),
				//tName = reader.GetStrValue("tName"),
				//FullName = reader.GetStrValue("FullName"),
				//AdresDost = reader.GetStrValue("AdresDost"),
			});
		}

		public List<Bil> GetBil()
		{
			var qs = HttpContext.Current.Request.QueryString;
			var id = qs["pId"];
			var top = qs["take"] ?? "30";
			var skip = qs["skip"] ?? "0";
			var searchString = qs["searchString"] ?? "";
			if (!string.IsNullOrEmpty(searchString))
				searchString = string.Format(" and (c.N Like '%{0}%') ", searchString);

			var user = HttpContext.Current.User.Identity.Name;
			var userTp = "-1";
			if (user.Split(';').Length > 1)
			{
				userTp = user.Split(';')[1];
			}
			else
			{
				//return new List<Bil> { new Bil() { sNote = "user not found " + user } };
			}
			var cmd = string.Format(SqlGetBil, userTp, searchString, skip, top);

			var result = ProcessBil(cmd);
			return result;
		}

		public Bil GetBilById(string id)
		{
			var cmd = string.Format(SqlGetBilById, id);
			var result = ProcessBil(cmd);
			return result[0];
		}

		public Bil PostBil()
		{
			var ret = new Bil {Note = ""};

			var user = HttpContext.Current.User.Identity.Name;
			var userId = "-1";
			if (user.Split(';').Length > 1)
			{
				userId = user.Split(';')[1];
			}
			else
			{
				//return new Bil() { Note = "user not found " + user };
			}
			var form = HttpContext.Current.Request.Form;
			var comand = form["cmd"];
			if (comand == "SaveBil")
			{
				var h = new XmlHelper.BAsketBil.CHeader()
				{
					IdC = form["IdC"],
					IdT = form["IdT"],
					Date = form["date"],
					Note = form["sNote"],
					SumDoc = form["sumDoc"],
					Wars = form["sWars"],
					Other = form["sOther"],
					IdLoc = form["IdLoc"],
					UserName = user
				};
				//var vOther = form["sOther"].Split(';');
				//var sup = (vOther.Length > 0 && vOther[0].Length > 0) ? vOther[0].Split(':')[1] : "";

				//			var sParam = string.Format("id={0};date={1};idCli={2};idTp={3};sOther={4};sWars={5};sNote={6};", 
				//                form["id"], form["date"], form["idCli"], form["idTp"], form["sOther"], form["sWars"], form["sNote"], user.Split(';')[1]);
				//var idServ = form["idServ"];
				var sParam = string.Format("{0}|{1}|{2}|{3}|{4}|{5}|{6}|{7}|{8}|{9}|",
					form["id"], userId, h.Date, h.IdC, h.IdT, h.Note, h.IdLoc, h.SumDoc, h.Wars, h.Other);

				var cmd = string.Format(SqlExecBilSave, sParam);
				var prm = BaseRepository.NewParamList(BaseRepository.NewParam("@Reply", "", ParameterDirection.Output, 100));

				ret.Note = BaseRepository.ExecuteScalar(cmd, prm).ToString();
				var vV = ret.Note.Split(' ');
				if (vV.Length > 1)
					ret.Id = vV[0];
				ret.LocNum = h.IdLoc;

				h.Result = ret.Note;
				var p = new XmlHelper.BAsketBil.CProds();
				if (h.Wars != null)
				{
					foreach (var w in h.Wars.Split(';'))
					{
						var wV = w.Split(':');
						if (wV.Length == 2)
							p.FProd.Add(new XmlHelper.BAsketBil.ProdItem {ProdId = wV[0], Quant = wV[1]});
					}
					var b = new XmlHelper.BAsketBil {Header = h, Products = p};
					XmlHelper.XmlOut(b);
				}
			}
			else if (comand == "DelBil")
			{
				BaseRepository.ExecuteScalar(string.Format(SqlDelBilSave, form["id"]));
				ret.Note = "Done";
			}
			else if (comand == "SendRepo")
			{
				RepoHelper.RepoPrint(form["id"], form["mail"]);
			}

			return ret;
		}

		#endregion

		#region RoadMap

		public List<RoadMap> GetRoadMap()
		{
			var qs = HttpContext.Current.Request.QueryString;
			var date = qs["date"];
			var top = qs["take"] ?? "30";
			var skip = qs["skip"] ?? "0";
			var searchString = qs["searchString"] ?? "";
			if (!string.IsNullOrEmpty(searchString))
				searchString = string.Format(" and (N Like '%{0}%') ", searchString);

			var user = HttpContext.Current.User.Identity.Name;
			var userId = "-1";
			if (user.Split(';').Length > 1)
			{
				userId = user.Split(';')[1];
			}
			else
			{
				//return new List<Bil> { new Bil() { sNote = "user not found " + user } };
			}
			date = (string.IsNullOrEmpty(qs["allGt"])) ? string.Format("='{0}'", date) : string.Format(">='{0}'", date);

			var cmd = string.Format(SqlGetRoadMap, userId, date, searchString, skip, top);

			var result = Common.ProcessCommand(cmd, reader => new RoadMap
			{
				Id = reader.GetStrValue("Id"),
				Npp = reader.GetStrValue("Npp"),
				D = reader.GetDateTime("DateRM").ToString("yyyy-MM-dd"),
				IdC = reader.GetStrValue("IdC"),
				IdT = reader.GetStrValue("IdT"),
				IdB = reader.GetStrValue("IdB"),
				Note = reader.GetStrValue("Note"),
				N1 = reader.GetStrValue("N1"),
				N2 = reader.GetStrValue("N2"),
				N3 = reader.GetStrValue("N3"),
				//P2 = reader.GetStrValue("P2"),
			});
			return result;
		}

		public RoadMap PostRoadMap()
		{
			var ret = new RoadMap {Note = ""};
			var form = HttpContext.Current.Request.Form;
			var comand = form["cmd"];
			if (comand == "UpdIdB")
			{
				BaseRepository.ExecuteScalar(string.Format(SqlUpdateRoadMapIdB, form["IdB"], form["Id"]));
				ret.Note = form["Id"] + " Updated";
			}

			return ret;
		}
	
		#endregion

		#region UpdateDBFromSwapFile

		public void UpdateDbFromSwapFile()
		{
			Common.SaveLog("DefaultPlugin.UpdateDbFromSwapFile");

			XmlHelper.BAsketSwap doc;
			var ser = XmlSerializer.FromTypes(new[] { typeof(XmlHelper.BAsketSwap) })[0];
			var fn = XmlHelper.CheckXmlStockFileName();
			using (var reader = XmlReader.Create(fn))
			{
				doc = (XmlHelper.BAsketSwap)ser.Deserialize(reader);
			}
			if (doc == null)
				return;

			var tran = BaseRepository.BeginTransaction();
			
			try
			{
				BaseRepository.ExecuteTransactionalCommand(tran, SqlExecUpdStock0, null);

				var cmd = "";
				foreach (var p in doc.Products.FProd)
				{
					p.Name1 = string.IsNullOrEmpty(p.Name1) ? "null" : "'" + p.Name1 + "'";
					p.Name2 = string.IsNullOrEmpty(p.Name2) ? "null" : "'" + p.Name2 + "'";
					p.Name3 = string.IsNullOrEmpty(p.Name3) ? "null" : "'" + p.Name3 + "'";
					p.Name4 = string.IsNullOrEmpty(p.Name4) ? "null" : "'" + p.Name4 + "'";
					p.Stock = string.IsNullOrEmpty(p.Stock) ? "0" : p.Stock;
					p.Price = string.IsNullOrEmpty(p.Price) ? "0" : p.Price.Replace(",", ".");
					//(Id,IdP,N,N1,N2,N3,N4,O,P,isWare) Values('{0}','{1}','{2}',{3},{4},{5},{6}, {7},{8},{9})";
					cmd = string.Format(SqlExecUpdInsProd, p.Id, p.IdP, p.Name, p.Name1, p.Name2, p.Name3, p.Name4,
						p.Stock, p.Price, string.IsNullOrEmpty(p.IdP) ? 0 : 1);
					BaseRepository.ExecuteTransactionalCommand(tran, cmd, null);
				}/**/
				foreach (var p in doc.Clients.FCli)
				{
					p.Name1 = string.IsNullOrEmpty(p.Name1) ? "null" : "'" + p.Name1 + "'";
					p.Name2 = string.IsNullOrEmpty(p.Name2) ? "null" : "'" + p.Name2 + "'";
					//(Id,IdP,N,N1,A) Values('{0}','{1}','{2}',{3},'{4}')";
					cmd = string.Format(SqlExecUpdInsCli, p.Id, p.IdP, p.Name, p.Name1, p.Adres);
					BaseRepository.ExecuteTransactionalCommand(tran, cmd, null);
				}/**/
				foreach (var p in doc.RoadMaps.FRoadMap)
				{
					if (string.IsNullOrEmpty(p.UserId) || string.IsNullOrEmpty(p.DateRec))
						continue;
					cmd = string.Format(SqlDeleteRoadMap, p.UserId);
					BaseRepository.ExecuteTransactionalCommand(tran, cmd, null);
					var dateList = Common.GetDateRecList(p.DateRec);
					foreach (var dt in dateList)
					{
						var ipp = 1;
						foreach (var c in p.FClients)
						{
							c.IdP = string.IsNullOrEmpty(c.IdP) ? "null" : "'" + c.IdP + "'";
							cmd = string.Format(SqlInsertRoadMap, p.UserId, dt.ToString("yyyy-MM-dd"), ipp++, c.Id, c.IdP);
							BaseRepository.ExecuteTransactionalCommand(tran, cmd, null);
						}
					}
				}/**/

				tran.Commit();
			}
			catch (Exception ex)
			{
				// Handle the exception if the transaction fails to commit.
				Common.SaveLog("UpdateDbFromSwapFile error: " + ex.Message);

				try
				{	// Attempt to roll back the transaction.
					tran.Rollback();
				}
				catch (Exception exRollback)
				{
				// Throws an InvalidOperationException if the connection 
				// is closed or the transaction has already been rolled 
				// back on the server.
					Common.SaveLog("UpdateDbFromSwapFile Rollback error: " + exRollback.Message);
					tran.Commit();
				}
			}
		}

		#endregion

	}
}
