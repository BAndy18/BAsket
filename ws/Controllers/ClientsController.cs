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
	public class ClientsController : ApiController
    {
		[Import]
		private IBAsketPlugin mPlugin;
		private ClientsController()
		{
			if (mPlugin == null) mPlugin = new DefaultPlugin();
		}

		public List<Client> Get(string id)
		{
			var result = mPlugin.GetClientsById(id);
			return result;
		}
		
		public List<Client> Get()
		{
			var result = mPlugin.GetClients();
			return result;
		}

////			//CustomBasicAuth.Authenticate(HttpContext.Current);

////			var qs = HttpContext.Current.Request.QueryString;
////			var id = qs["pId"];
////			var top = int.Parse(qs["take"] ?? "30");
////			var skip = int.Parse(qs["skip"] ?? "0");
////			var searchString = qs["searchString"] ?? "";
//////            if (string.IsNullOrEmpty(searchString))
////  //              searchString = "' '"; 
////			//if (!string.IsNullOrEmpty(searchString))
////			//    searchString = string.Format(" and Name Like '%{0}%' ", searchString);

////			var cmd = (id == "all") 
////				? mPlugin.GetSqlCommand("CliAll") 
////				: string.Format(mPlugin.GetSqlCommand("Cli"), searchString, skip, top);

////			return ProcessCommand(cmd);
//		}

		//List<Client> ProcessCommand(string cmd, int limit = -1)
		//{
		//	List<Client> result;
		//	using (var reader = BaseRepository.ExecuteReaderEx("BAsket", cmd, null))
		//	{
		//		if (reader == null)
		//			return null;
		//		result = mPlugin.ReadClient(reader);
		//		//try
		//		//{
		//		//	while (reader.Read())
		//		//	{
		//		//		result.Add(new Client()
		//		//			{
		//		//				Id = reader.GetString(Common.GetName("Id")),
		//		//				IdP = reader.GetString(Common.GetName("IdP")),
		//		//				N = reader.GetString(Common.GetName("N")),
		//		//				A = reader.GetString(Common.GetName("A")),
		//		//				//N2 = reader.GetString(Common.GetName("N2")),
		//		//			});
		//		//		limit--;
		//		//		if (limit == 0) break;
		//		//	}
		//		//}
		//		//catch (Exception ex)
		//		//{
		//		//	return new List<Client> { new Client() { Name = ex.Message + ex.StackTrace } };
		//		//}
		//	}
		//	Common.AddCorsHeaders(HttpContext.Current.Response);
		//	return result;
		//}
    }
}