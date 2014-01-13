using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using System.Security.Principal;
using BAsketWS.DataAccess;
using BAsketWS.Models;

namespace BAsketWS.Controllers
{
    public class BilMController : ApiController
    {
        public BilM Get(string id)
        {
            var cmd = string.Format(Common.SqlCommands["BilMById"], id);
            var ret = ProcessCommand(cmd, 1);
            return ret[0];
        }

        public List<BilM> Get()
        {
            var qs = HttpContext.Current.Request.QueryString;
            var top = qs["take"] ?? "30";
            var skip = qs["skip"] ?? "0";
            var searchString = qs["searchString"] ?? "''";
            if (string.IsNullOrEmpty(searchString))
                searchString = "' '";
            //if (!string.IsNullOrEmpty(searchString))
            //    searchString = string.Format(" and Name Like '%{0}%' ", searchString);
            var user = HttpContext.Current.User.Identity.Name;
            //var roles = ((user as System.Security.Principal.GenericPrincipal) as System.Security.Claims.ClaimsPrincipal);
                //[1].Value;
            //var ticket = FormsAuthentication.Decrypt(HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName].Value);
            //String[] roles = ticket.UserData.Split(',');

            var cmd = string.Format(Common.SqlCommands["BilM"], user.Split(';')[1], searchString, skip + 1, top);

            return ProcessCommand(cmd);
        }

        List<BilM> ProcessCommand(string cmd, int limit = -1)
        {
            var result = new List<BilM>();
            using (var reader = BaseRepository.ExecuteReaderEx("BAsket", cmd, null))
            {
                if (reader == null)
                    return null;
                try
                {
                    while (reader.Read())
                    {
                        result.Add(new BilM()
                            {
                                Id = reader.GetInt32(Common.GetName("r_bil")).ToString(),
                                DateDoc = reader.GetDateTime(Common.GetName("DateDoc")).ToString(),
                                SumDoc = reader.GetDecimal(Common.GetName("SumDoc")).ToString(),
                                sNote = reader.GetString(Common.GetName("Note")),
                                cName = reader.GetString(Common.GetName("cName")),
                                tName = reader.GetString(Common.GetName("tName")),
                                FullName = reader.GetString(Common.GetName("FullName")),
                                AdresDost = reader.GetString(Common.GetName("AdresDost")),
                            });
                        limit--;
                        if (limit == 0) break;
                    }
                }
                catch (Exception ex)
                {
                    return new List<BilM> { new BilM() { cName = ex.Message + ex.StackTrace } };
                }
            }
            Common.AddCorsHeaders(HttpContext.Current.Response);
            return result;
        }
    }


}