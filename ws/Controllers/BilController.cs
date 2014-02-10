using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Web.Http;
using BAsketWS.DataAccess;
using BAsketWS.Helpers;
using BAsketWS.Models;

namespace BAsketWS.Controllers
{
	[Export]
	[PartCreationPolicy(CreationPolicy.NonShared)]
	public class BilController : ApiController
    {
		[Import]
		private IBAsketPlugin mPlugin;
		private BilController()
		{
			if (mPlugin == null) mPlugin = new DefaultPlugin();
		}

		public Bil Get(string id)
		{
			var result = mPlugin.GetBilById(id);
			return result;
		}
		
		public List<Bil> Get()
		{
			var result = mPlugin.GetBil();
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
		//		return new List<Bil> {new Bil() {sNote = "user not found " + user}};
		//	}

		//	var cmd = string.Format(Common.SqlCommands["Bil"], userTp, searchString, skip + 1, top);

		//	return ProcessCommand(cmd);
		//}

		//List<Bil> ProcessCommand(string cmd, int limit = -1)
		//{
		//	var result = new List<Bil>();
		//	using (var reader = BaseRepository.ExecuteReaderEx(cmd))
		//	{
		//		if (reader == null)
		//			return null;
		//		try
		//		{
		//			while (reader.Read())
		//			{
		//				var Bil = new Bil()
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
		//				Bil.ShortDate = Bil.DateDoc.Substring(0, 5);

		//				result.Add(Bil);

		//				limit--;
		//				if (limit == 0) break;
		//			}
		//		}
		//		catch (Exception ex)
		//		{
		//			return new List<Bil> { new Bil() { cName = ex.Message + ex.StackTrace } };
		//		}
		//	}
		//	Common.AddCorsHeaders(HttpContext.Current.Response);
		//	return result;
		//}

        // POST api/values
		//public List<Bil> Post([FromBody]string value)
		//public IEnumerable<SpWar> Post(JObject jsonData)
		//public string Post(JObject jsonData)
		[HttpPost]
		public Bil Post()
		{
			var result = mPlugin.PostBil();
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
//				return new Bil() { sNote = "user not found " + user };
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

//				var cmd = string.Format(Common.SqlCommands["BilSave"], sParam);
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

//			return new Bil() { sNote = retvalue };
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