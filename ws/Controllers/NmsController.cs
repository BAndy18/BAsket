using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
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
                try
                {
                    //if (cmd == "0")
                    //{
                    //    result.Add(new Nms {IdRoot = 0, Id = 1, Name = "Предприятие"});
                    //    result.Add(new Nms {IdRoot = 0, Id = 2, Name = "Тип Оплаты"});
                    //} else
                    //if (cmd == "1")
                    //{
                    //    result.Add(new Nms {IdRoot = 1, Id = 1, Name = "Пупкин ЧП"});
                    //    result.Add(new Nms {IdRoot = 1, Id = 2, Name = "Ступкин ООО"});
                    //} else
                    //if (cmd == "2")
                    //{
                    //    result.Add(new Nms { IdRoot = 2, Id = 1, Name = "наличные" });
                    //    result.Add(new Nms { IdRoot = 2, Id = 2, Name = "безнал" });
                    //} 

	                //var name = _myTest.GetMessage();

                    while (reader.Read())
                    {
                        result.Add(new Nms()
                            {
                                IdRoot = reader.GetInt32(Common.GetName("T_NMS")),
                                Id = reader.GetInt32(Common.GetName("N_NMS")),
								//Name = name,
								Name = reader.GetString(Common.GetName("Name")),
                            });
                        limit--;
                        if (limit == 0) break;
                    }
                }
                catch (Exception ex)
                {
                    return new List<Nms> { new Nms() { Name = ex.Message + ex.StackTrace } };
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