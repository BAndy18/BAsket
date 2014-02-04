using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using BAsketWS.DataAccess;
using BAsketWS.Models;

namespace BAsketWS.Controllers
{
	//[Export]
	//[PartCreationPolicy(CreationPolicy.NonShared)]
	public class NmsController : ApiController
    {
		//[Import]
		//private IMyTest _myTest;

        public List<Nms> Get()
        {
			//DbfHelper.readDbf();

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


	public interface IMyTest
	{
		String GetMessage();
	}

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