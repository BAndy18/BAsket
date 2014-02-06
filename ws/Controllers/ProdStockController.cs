﻿using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Web.Http;
using BAsketWS.DataAccess;
using BAsketWS.Helpers;
using BAsketWS.Models;

namespace BAsketWS.Controllers
{
	[Export]
	[PartCreationPolicy(CreationPolicy.NonShared)]
	public class ProdStockController : ApiController
    {
		[Import]
		private IBAsketPlugin mPlugin;
		private ProdStockController()
		{
			if (mPlugin == null) mPlugin = new DefaultPlugin();
		}

		public List<ProdStock> Get()
		{
			var result = mPlugin.GetProdStock();
			return result;
		}

		//var qs = HttpContext.Current.Request.QueryString;
		//	var grId = qs["Id"];
		//	var cmd = Common.SqlCommands["War"];

		//	var result = new List<ProdOst>();
		//	using (var reader = BaseRepository.ExecuteReaderEx(cmd))
		//	{
		//		if (reader == null)
		//			return null;
		//		while (reader.Read())
		//		{
		//			result.Add(new ProdOst()
		//				{
		//					/*
		//					Id = reader.GetInt32(Common.GetName("r_war")).ToString(),
		//					O = reader.GetFloat(Common.GetName("Ostat")).ToString(),
		//					/*/
		//					Id = reader.GetString("r_war"),
		//					O = reader.GetInt32("Ostat").ToString(),
		//					/**/
		//				});
		//		}
		//	}
		//	Common.AddCorsHeaders(HttpContext.Current.Response);
		//	return result;
		//}
    }
}