using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using BAsketWS.DataAccess;
using BAsketWS.Models;

namespace BAsketWS.Controllers
{
    public class NmsController : ApiController
    {
        public List<Nms> Get(string id)
        {
            //var cmd = Common.SqlCommands["Nms"];

            return ProcessCommand(id);
        }

        List<Nms> ProcessCommand(string cmd, int limit = -1)
        {
            var result = new List<Nms>();
            //using (var reader = BaseRepository.ExecuteReaderEx("BAsket", cmd, null))
            {
                //if (reader == null)
                //    return null;
                try
                {
                    if (cmd == "0")
                    {
                        result.Add(new Nms {IdRoot = 0, Id = 1, Name = "Предприятие"});
                        result.Add(new Nms {IdRoot = 0, Id = 2, Name = "Тип Оплаты"});
                    } else
                    if (cmd == "1")
                    {
                        result.Add(new Nms {IdRoot = 1, Id = 1, Name = "Пупкин ЧП"});
                        result.Add(new Nms {IdRoot = 1, Id = 2, Name = "Ступкин ООО"});
                    } else
                    if (cmd == "2")
                    {
                        result.Add(new Nms { IdRoot = 2, Id = 1, Name = "наличные" });
                        result.Add(new Nms { IdRoot = 2, Id = 2, Name = "безнал" });
                    } 

                    //while (reader.Read())
                    //{
                    //    result.Add(new Nms()
                    //        {
                    //            Id = reader.GetInt32(Common.GetName("r_cli")).ToString(),
                    //            Name = reader.GetString(Common.GetName("Name")).Replace("'", "''"),
                    //        });
                    //    limit--;
                    //    if (limit == 0) break;
                    //}
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


}