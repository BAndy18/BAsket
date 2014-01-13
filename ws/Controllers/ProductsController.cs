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
            var grId = qs["grId"];
            var top = qs["take"] ?? "30";
            var skip = qs["skip"] ?? "0";
            var searchString = qs["searchString"] ?? "''";
            if (string.IsNullOrEmpty(searchString))
                searchString = "' '";
            //if (!string.IsNullOrEmpty(searchString))
            //    searchString = string.Format(" and Name Like '%{0}%' ", searchString);

            var cmd = string.Format(Common.SqlCommands["WarsByGId"], grId, searchString, skip+1, top);
            if (grId == "all")
                cmd = Common.SqlCommands["War"];

            return ProcessCommand(cmd);
        }

        List<Product> ProcessCommand(string cmd, int limit = -1)
        {
            var result = new List<Product>();
            using (var reader = BaseRepository.ExecuteReaderEx("BAsket", cmd, null))
            {
                if (reader == null)
                    return null;
                try
                {
                    while (reader.Read())
                    {
                        result.Add(new Product()
                            {
                                //*
                                Id = reader.GetInt32(Common.GetName("r_war")).ToString(),
                                GrId = reader.GetInt32(Common.GetName("r_hwar")).ToString(),
                                Upak = reader.GetInt16(Common.GetName("NUPK")).ToString(),
                                Ostat = reader.GetFloat(Common.GetName("Ostat")).ToString(),
                                /*/
                                Id = reader.GetString(Common.GetName("r_war")),
                                GrId = reader.GetString(Common.GetName("r_hwar")),
                                NameManuf = reader.GetString(Common.GetName("Name_manuf")).Replace("'", "''"),
                                UrlPict = reader.GetString(Common.GetName("Name_pict")).Replace("'", "''"),
                                Upak = reader.GetInt32(Common.GetName("Upak")).ToString(),
                                Ostat = reader.GetInt32(Common.GetName("Ostat")).ToString(),
                                /**/
                                Name = reader.GetString(Common.GetName("Name")),
                                NameArt = reader.GetString(Common.GetName("Name_c")),
                                Price = reader.GetDecimal(Common.GetName("Price"))
                            });
                        limit--;
                        if (limit == 0) break;
                    }
                }
                catch (Exception ex)
                {
                    return new List<Product>{ new Product(){Name = ex.Message + ex.StackTrace}};
                }
            }
            Common.AddCorsHeaders(HttpContext.Current.Response);
            return result;
        }
    }


}