using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using BAsketWS.DataAccess;
using BAsketWS.Models;

namespace BAsketWS.Controllers
{
    public class ClientsController : ApiController
    {
        public List<Client> Get(string id)
        {
            var qs = HttpContext.Current.Request.QueryString;
            var fil = qs["fil"];
            var cmd = (fil == null) 
                ? string.Format(Common.SqlCommands["CliById"], id)
                : string.Format(Common.SqlCommands["CliFil"], id);
            var ret = ProcessCommand(cmd);
            return ret;
        }

        public List<Client> Get()
        {
            //CustomBasicAuth.Authenticate(HttpContext.Current);

            var qs = HttpContext.Current.Request.QueryString;
            var id = qs["pId"];
            var top = int.Parse(qs["take"] ?? "30");
            var skip = int.Parse(qs["skip"] ?? "0");
            var searchString = qs["searchString"] ?? "";
//            if (string.IsNullOrEmpty(searchString))
  //              searchString = "' '"; 
            //if (!string.IsNullOrEmpty(searchString))
            //    searchString = string.Format(" and Name Like '%{0}%' ", searchString);

            var cmd = string.Format(Common.SqlCommands["Cli"], searchString, skip, top);

            if (id == "all")
                cmd = Common.SqlCommands["CliAll"];

            return ProcessCommand(cmd);
        }

        List<Client> ProcessCommand(string cmd, int limit = -1)
        {
            var result = new List<Client>();
            using (var reader = BaseRepository.ExecuteReaderEx("BAsket", cmd, null))
            {
                if (reader == null)
                    return null;
                //try
                {
                    while (reader.Read())
                    {
                        result.Add(new Client()
                            {
								Id = reader.GetString(Common.GetName("Id")),
								IdP = reader.GetString(Common.GetName("IdP")),
                                N = reader.GetString(Common.GetName("N")),
                                A = reader.GetString(Common.GetName("A")),
                                //N2 = reader.GetString(Common.GetName("N2")),
                            });
                        limit--;
                        if (limit == 0) break;
                    }
                }
				//catch (Exception ex)
				//{
				//	return new List<Client> { new Client() { Name = ex.Message + ex.StackTrace } };
				//}
            }
            Common.AddCorsHeaders(HttpContext.Current.Response);
            return result;
        }
    }


}