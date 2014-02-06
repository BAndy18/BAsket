using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Web.Http;
using BAsketWS.DataAccess;
using BAsketWS.Helpers;
using BAsketWS.Models;

namespace BAsketWS.Controllers
{
	[Export]
	[PartCreationPolicy(CreationPolicy.NonShared)]
	public class BilMController : ApiController
    {
		[Import]
		private IBAsketPlugin mPlugin;
		private BilMController()
		{
			if (mPlugin == null) mPlugin = new DefaultPlugin();
		}

		public BilM Get(string id)
		{
			var result = mPlugin.GetBilMById(id);
			return result;
		}
		
		public List<BilM> Get()
		{
			var result = mPlugin.GetBilM();
			return result;
		}

		//var qs = HttpContext.Current.Request.QueryString;
		//	var top = int.Parse(qs["take"] ?? "30");
		//	var skip = int.Parse(qs["skip"] ?? "0");
		//	var searchString = qs["searchString"] ?? "''";
		//	if (string.IsNullOrEmpty(searchString))
		//		searchString = "' '";
		//	//if (!string.IsNullOrEmpty(searchString))
		//	//    searchString = string.Format(" and Name Like '%{0}%' ", searchString);

		//	var user = HttpContext.Current.User.Identity.Name;
		//	var userTp = "-1";
		//	if (user.Split(';').Length > 1)
		//	{
		//		userTp = user.Split(';')[1];
		//	}
		//	else
		//	{
		//		return new List<BilM> {new BilM() {sNote = "user not found " + user}};
		//	}

		//	var cmd = string.Format(Common.SqlCommands["BilM"], userTp, searchString, skip + 1, top);

		//	return ProcessCommand(cmd);
		//}

		//List<BilM> ProcessCommand(string cmd, int limit = -1)
		//{
		//	var result = new List<BilM>();
		//	using (var reader = BaseRepository.ExecuteReaderEx(cmd))
		//	{
		//		if (reader == null)
		//			return null;
		//		try
		//		{
		//			while (reader.Read())
		//			{
		//				var bilm = new BilM()
		//					{
		//						Id = reader.GetInt32("r_bil").ToString(),
		//						IdCli = reader.GetInt32("r_cli").ToString(),
		//						IdTp = reader.GetInt32("r_fcli").ToString(),
		//						DateDoc = reader.GetDateTime("DateDoc").ToString(),
		//						SumDoc = reader.GetDecimal("SumDoc").ToString("N2"),
		//						sNote = reader.GetString("Note"),
		//						cName = reader.GetString("cName"),
		//						tName = reader.GetString("tName"),
		//						FullName = reader.GetString("FullName"),
		//						AdresDost = reader.GetString("AdresDost"),
		//					};
		//				bilm.ShortDate = bilm.DateDoc.Substring(0, 5);

		//				result.Add(bilm);

		//				limit--;
		//				if (limit == 0) break;
		//			}
		//		}
		//		catch (Exception ex)
		//		{
		//			return new List<BilM> { new BilM() { cName = ex.Message + ex.StackTrace } };
		//		}
		//	}
		//	Common.AddCorsHeaders(HttpContext.Current.Response);
		//	return result;
		//}

        // POST api/values
		//public List<BilM> Post([FromBody]string value)
		//public IEnumerable<SpWar> Post(JObject jsonData)
		//public string Post(JObject jsonData)
		[HttpPost]
		public BilM Post()
		{
			var result = mPlugin.PostBilM();
			return result;
		}

//		var retvalue = "";
//			var user = HttpContext.Current.User.Identity.Name;
//			var userTp = "-1";
//			if (user.Split(';').Length > 1)
//			{
//				userTp = user.Split(';')[1];
//			}
//			else
//			{
//				return new BilM() { sNote = "user not found " + user };
//			}
//			var form = HttpContext.Current.Request.Form;
//			var comand = form["cmd"];
//			if (comand == "SaveBil")
//			{
//				var vOther = form["sOther"].Split(';');
//				var sup = (vOther.Length > 0 && vOther[0].Length > 0) ? vOther[0].Split(':')[1] : "";

////			var sParam = string.Format("id={0};date={1};idCli={2};idTp={3};sOther={4};sWars={5};sNote={6};", 
////                form["id"], form["date"], form["idCli"], form["idTp"], form["sOther"], form["sWars"], form["sNote"], user.Split(';')[1]);
//				var idServ = form["idServ"];
//				var sParam = string.Format("{0}|{1}|{2}|{3}|{4}|{5}|{6}|{7};|",
//					sup, form["date"], form["idCli"], form["idTp"], form["sNote"], userTp, idServ, form["sWars"]);

//				var cmd = string.Format(Common.SqlCommands["BilMSave"], sParam);
//				var prm = new List<SqlParameter>
//				{
//					new SqlParameter("@Reply", "") {Direction = ParameterDirection.Output, Size = 100}
//				};

//				retvalue = BaseRepository.ExecuteScalar("BAsket", cmd, prm).ToString();
//			}
//			else if (comand == "SendRepo")
//			{
//				RepoHelper.RepoPrint(form["id"], form["mail"]);
//			}

//			return new BilM() { sNote = retvalue };
//		}

           // PUT api/values/5
		//public void Put(int id, [FromBody]string value)
		//{
		//	var fr = HttpContext.Current.Request.Form;
		//}

		//// DELETE api/values/5
		//public void Delete(int id)
		//{
		//}
    }
}