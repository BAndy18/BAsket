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
	public class NmsController : ApiController
    {
		[Import]
		private IBAsketPlugin mPlugin;
		//private NmsController()
		//{
		//	if (mPlugin == null) mPlugin = new DefaultPlugin();
		//}

		public List<Nms> Get()
		{
			mPlugin = Common.PluginInit(mPlugin);

			Common.ReadTest(mPlugin);

			var result = mPlugin.GetNms();
			return result;
		}
    }
}

//public delegate string StringTransformer(string src);

//[ImportMany("StringTransformer")]
//public IEnumerable<StringTransformer> Transformers
//{ get; set; }


//var catalog = new AggregateCatalog();
//var path = Path.GetDirectoryName(new Uri(Assembly.GetExecutingAssembly().CodeBase).LocalPath);
////catalog.Catalogs.Add(new DirectoryCatalog(path));
//catalog.Catalogs.Add(new AssemblyCatalog(Assembly.GetExecutingAssembly()));
//var container = new CompositionContainer(catalog);
////container.SatisfyImportsOnce(this);

//DbfHelper.readDbf();
//foreach (var transformer in Transformers) 
//{
//	Console.WriteLine(transformer("Sample StRiNg."));
//}
//var t = Transformers[0];
//mPlugin.GetMessage();
//var scmd = mPlugin == null ? Common.SqlCommands["WarsByGId"] : mPlugin.SqlCommand("WarsByGId");

//	var cmd = mPlugin.GetSqlCommand("Nms");

//	return ProcessCommand(cmd);
//}

//List<Nms> ProcessCommand(string cmd, int limit = -1)
//{
//	List<Nms> result;
//	using (var reader = BaseRepository.ExecuteReaderEx("BAsket", cmd, null))
//	{
//		if (reader == null)
//			return null;
//		//if (mPlugin == null)
//		//	mPlugin = new DefaultPlugin();

//		result = mPlugin.ReadNms(reader);
//		//while (reader.Read())
//		//{
//		//	result.Add(new Nms()
//		//		{
//		//			IdP = reader.GetInt32(Common.GetName("IdP")),
//		//			Id = reader.GetInt32(Common.GetName("Id")),
//		//			N = reader.GetString(Common.GetName("N")),
//		//		});
//		//	limit--;
//		//	if (limit == 0) break;
//		//}
//	}
//	Common.AddCorsHeaders();
//	return result;
//}
