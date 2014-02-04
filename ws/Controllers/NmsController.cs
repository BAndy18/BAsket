using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.ComponentModel.Composition.Hosting;
using System.IO;
using System.Reflection;
using System.Web;
using System.Web.Http;
using BAsketWS.DataAccess;
using BAsketWS.Models;

namespace BAsketWS.Controllers
{
	public delegate string StringTransformer(string src);

	[Export]
	//[PartCreationPolicy(CreationPolicy.NonShared)]
	public class NmsController : ApiController
    {
		[Import]
		private IBAsketPlugin mPlugin;

		//[ImportMany("StringTransformer")]
		//public IEnumerable<StringTransformer> Transformers
		//{ get; set; }

        public List<Nms> Get()
        {
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
			var scmd = mPlugin == null ? Common.SqlCommands["WarsByGId"] : mPlugin.SqlCommand("WarsByGId");

            var cmd = Common.SqlCommands["Nms"];

            return ProcessCommand(cmd);
        }

        List<Nms> ProcessCommand(string cmd, int limit = -1)
        {
            var result = new List<Nms>();
            using (var reader = BaseRepository.ExecuteReaderEx("BAsket", cmd, null))
            {
                if (reader == null)
                    return null;

                while (reader.Read())
                {
                    result.Add(new Nms()
                        {
							IdP = reader.GetInt32(Common.GetName("IdP")),
							Id = reader.GetInt32(Common.GetName("Id")),
							N = reader.GetString(Common.GetName("N")),
                        });
                    limit--;
                    if (limit == 0) break;
                }
            }
            Common.AddCorsHeaders(HttpContext.Current.Response);
            return result;
        }
    }


	public interface IBAsketPlugin
	{
		string SqlCommand(string cmd);
		string GetMessage();
	}

	//public interface IBAsketPluginMetadata
	//{
	//	string Name { get; }
	//	//string Version { get; }
	//}

	//[MetadataAttribute]
	//[AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
	//public class MessageMetadataAttribute : ExportAttribute, IBAsketPluginMetadata
	//{
	//	public MessageMetadataAttribute(string name, string version)
	//		: base(typeof(IBAsketPlugin))
	//	{
	//		Name = name;
	//		//Version = version;
	//	}

	//	public string Name { get; set; }
	//	public string Version { get; set; }
	//}

	////[ExportMetadata("ViewType", "MyTest1")]
	////[Export(typeof(IMyTest))]
	////public class MyTest1 : IMyTest
	////{
	////	public MyTest1()
	////	{
	////		creationDate = DateTime.Now;
	////	}

	////	public string GetMessage()
	////	{
	////		return String.Format("MyTest1 created at {0}", creationDate.ToString("hh:mm:ss"));
	////	}

	////	private DateTime creationDate;
	////}

}