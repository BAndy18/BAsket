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
	public class ProductsController : ApiController
    {
		[Import]
		private IBAsketPlugin mPlugin;
		//private ProductsController()
		//{
		//	if (mPlugin == null) mPlugin = new DefaultPlugin();
		//}

        public Product Get(string id)
        {
			mPlugin = Common.PluginInit(mPlugin);

			var result = mPlugin.GetProductById(id);
			return result;
        }

		public List<Product> Get()
		{
			mPlugin = Common.PluginInit(mPlugin);

			var result = mPlugin.GetProducts();
			return result;
		}

		//var qs = HttpContext.Current.Request.QueryString;
	        //var id = qs["pId"];
	        //var top = qs["take"] ?? "30";
	        //var skip = qs["skip"] ?? "0";
	        //var searchString = qs["searchString"] ?? "";
	        ////if (string.IsNullOrEmpty(searchString))
	        ////	searchString = "' '";
	        ////if (!string.IsNullOrEmpty(searchString))
	        ////    searchString = string.Format(" and Name Like '%{0}%' ", searchString);

	        //var cmd = (id == "all" || id == "ost") ?
	        //	mPlugin.GetSqlCommand("War") :
	        //	string.Format(mPlugin.GetSqlCommand("SqlGetProductsByPId"),
	        //		id, searchString, skip, top);

	        //return ProcessCommand(cmd);
        //}

		//List<Product> ProcessCommand(string cmd, int limit = -1)
		//{
		//	List<Product> result = null;
		//	using (var reader = BaseRepository.ExecuteReaderEx(cmd))
		//	{
		//		if (reader == null)
		//			return null;
		//		result = mPlugin.ReadProducts(reader);
				//else
				//{
				//	result = new List<Product>();
				//	while (reader.Read())
				//	{
				//		result.Add(new Product()
				//			{
				//				/*
				//				Id = reader.GetInt32(Common.GetName("r_war")).ToString(),
				//				IdP = reader.GetInt32(Common.GetName("r_hwar")).ToString(),
				//				N4 = reader.GetInt16(Common.GetName("NUPK")).ToString(),
				//				O = reader.GetFloat(Common.GetName("Ostat")).ToString(),
				//				/*/
				//				Id = reader.GetString(Common.GetName("Id")),
				//				IdP = reader.GetString(Common.GetName("IdP")),
				//				N2 = reader.GetString(Common.GetName("N2")),	//NameManuf
				//				N3 = reader.GetString(Common.GetName("N3")),	//UrlPict - Name_pict
				//				N4 = reader.GetInt32(Common.GetName("N4")).ToString(),	//Upak 
				//				//O = reader.GetInt32(Common.GetName("O")).ToString(),
				//				O = reader.GetStrValue("O"),
				//				/**/
				//				N = reader.GetString(Common.GetName("N")),
				//				N1 = reader.GetString(Common.GetName("N1")),	//NameArt
				//				P = reader.GetDecimal(Common.GetName("P"))
				//			});
				//		limit--;
				//		if (limit == 0) break;
				//	}
				//}
		//	}
		//	Common.AddCorsHeaders(HttpContext.Current.Response);
		//	return result;
		//}
    }
}