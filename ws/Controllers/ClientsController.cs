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
            var id = qs["IdAll"];
            var top = qs["take"] ?? "30";
            var skip = qs["skip"] ?? "0";
            var searchString = qs["searchString"] ?? "''";
            if (string.IsNullOrEmpty(searchString))
                searchString = "' '"; 
            //if (!string.IsNullOrEmpty(searchString))
            //    searchString = string.Format(" and Name Like '%{0}%' ", searchString);

            var cmd = string.Format(Common.SqlCommands["Cli"], searchString, skip+1, top);

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
                try
                {
                    while (reader.Read())
                    {
                        result.Add(new Client()
                            {
                                Id = reader.GetInt32(Common.GetName("r_cli")).ToString(),
                                IdPar = reader.GetInt32(Common.GetName("r_fcli")).ToString(),
                                Name = reader.GetString(Common.GetName("Name")),
                                Adres = reader.GetString(Common.GetName("Adres")),
                                FullName = reader.GetString(Common.GetName("FullName")),
                            });
                        limit--;
                        if (limit == 0) break;
                    }
                }
                catch (Exception ex)
                {
                    return new List<Client> { new Client() { Name = ex.Message + ex.StackTrace } };
                }
            }
            Common.AddCorsHeaders(HttpContext.Current.Response);
            return result;
        }
    }


}