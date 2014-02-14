using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Web.Http;
using BAsketWS.DataAccess;
using BAsketWS.Models;

namespace BAsketWS.Controllers
{
	[Export]
	[PartCreationPolicy(CreationPolicy.NonShared)]
	public class RoadMapController : ApiController
    {
		[Import]
		private IBAsketPlugin mPlugin;

		//public RoadMap Get(string id)
		//{
		//	mPlugin = Common.PluginInit(mPlugin);

		//	var result = mPlugin.GetRoadMapById(id);
		//	return result;
		//}

		public List<RoadMap> Get()
		{
			mPlugin = Common.PluginInit(mPlugin);

			var result = mPlugin.GetRoadMap();
			return result;
		}

		[HttpPost]
		public RoadMap Post()
		{
			mPlugin = Common.PluginInit(mPlugin);

			var result = mPlugin.PostRoadMap();
			return result;
		}
	}
}