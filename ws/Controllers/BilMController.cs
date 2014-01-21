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
            var top = int.Parse(qs["take"] ?? "30");
            var skip = int.Parse(qs["skip"] ?? "0");
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
                        var bilm = new BilM()
                            {
                                Id = reader.GetInt32(Common.GetName("r_bil")).ToString(),
                                IdCli = reader.GetInt32(Common.GetName("r_cli")).ToString(),
                                IdTp = reader.GetInt32(Common.GetName("r_fcli")).ToString(),
                                DateDoc = reader.GetDateTime(Common.GetName("DateDoc")).ToString(),
                                SumDoc = reader.GetDecimal(Common.GetName("SumDoc")).ToString("N2"),
                                sNote = reader.GetString(Common.GetName("Note")),
                                cName = reader.GetString(Common.GetName("cName")),
                                tName = reader.GetString(Common.GetName("tName")),
                                FullName = reader.GetString(Common.GetName("FullName")),
                                AdresDost = reader.GetString(Common.GetName("AdresDost")),
                            };
                        bilm.ShortDate = bilm.DateDoc.Substring(0, 5);

                        result.Add(bilm);

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

        // POST api/values
        [HttpPost]
        public BilM Post()
        //public List<BilM> Post([FromBody]string value)
        //public IEnumerable<SpWar> Post(JObject jsonData)
        //public string Post(JObject jsonData)
        {
            var form = HttpContext.Current.Request.Form;
            //form["date"]
            var user = HttpContext.Current.User.Identity.Name;
            var strPrm = string.Format("id={0};date={1};idCli={2};idTp={3};sOther={4};sWars={5};sNote={6}", 
                form["id"], form["date"], form["idCli"], form["idTp"], form["sOther"], form["sWars"], form["sNote"]);

            var cmd = string.Format(Common.SqlCommands["BilMSave"], user.Split(';')[1], strPrm);

            return new BilM() { cName = "POST" } ;
        }

           // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }

    }
}