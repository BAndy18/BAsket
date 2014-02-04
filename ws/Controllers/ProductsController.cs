using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using BAsketWS.DataAccess;
using BAsketWS.Models;

namespace BAsketWS.Controllers
{
    public class ProductsController : ApiController
    {
        public Product Get(string id)
        {
            var cmd = string.Format(Common.SqlCommands["WarById"], id);
            var ret = ProcessCommand(cmd, 1);
            return ret[0];
        }

        public List<Product> Get()
        {
            var qs = HttpContext.Current.Request.QueryString;
            var id = qs["pId"];
            var top = qs["take"] ?? "30";
            var skip = qs["skip"] ?? "0";
            var searchString = qs["searchString"] ?? "";
			//if (string.IsNullOrEmpty(searchString))
			//	searchString = "' '";
            //if (!string.IsNullOrEmpty(searchString))
            //    searchString = string.Format(" and Name Like '%{0}%' ", searchString);

            var cmd = string.Format(Common.SqlCommands["WarsByGId"], id, searchString, skip, top);
			if (id == "all" || id == "ost")
                cmd = Common.SqlCommands["War"];

            return ProcessCommand(cmd);
        }

        List<Product> ProcessCommand(string cmd, int limit = -1)
        {
            var result = new List<Product>();
            using (var reader = BaseRepository.ExecuteReaderEx(cmd))
            {
                if (reader == null)
                    return null;
                //try
                {
                    while (reader.Read())
                    {
                        result.Add(new Product()
                            {
                                /*
                                Id = reader.GetInt32(Common.GetName("r_war")).ToString(),
                                IdP = reader.GetInt32(Common.GetName("r_hwar")).ToString(),
                                N4 = reader.GetInt16(Common.GetName("NUPK")).ToString(),
                                O = reader.GetFloat(Common.GetName("Ostat")).ToString(),
                                /*/
                                Id = reader.GetString(Common.GetName("Id")),
                                IdP = reader.GetString(Common.GetName("IdP")),
								N2 = reader.GetString(Common.GetName("N2")),	//NameManuf
								N3 = reader.GetString(Common.GetName("N3")),	//UrlPict - Name_pict
								N4 = reader.GetInt32(Common.GetName("N4")).ToString(),	//Upak 
								//O = reader.GetInt32(Common.GetName("O")).ToString(),
								O = reader.GetStrValue("O"),
                                /**/
                                N = reader.GetString(Common.GetName("N")),
                                N1 = reader.GetString(Common.GetName("N1")),	//NameArt
                                P = reader.GetDecimal(Common.GetName("P"))
                            });
                        limit--;
                        if (limit == 0) break;
                    }
                }
				//catch (Exception ex)
				//{
				//	return new List<Product>{ new Product(){N = ex.Message + ex.StackTrace}};
				//}
            }
            Common.AddCorsHeaders(HttpContext.Current.Response);
            return result;
        }
    }


}