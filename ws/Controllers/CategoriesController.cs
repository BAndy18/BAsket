using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using BAsketWS.DataAccess;
using BAsketWS.Models;

namespace BAsketWS.Controllers
{
    public class CategoriesController : ApiController
    {
        // GET api/values
        //*
        //public void Get()
        //public string Get()
        public IEnumerable<Category> Get()
        {
            var qs = HttpContext.Current.Request.QueryString;
            var jcmd = qs["cmd"];
            var jdata = qs["data"];
            var jusr = qs["usr"];

            //Common.CheckPriceStatus(null);
            //Common.readDbf();

            var result = new List<Category>();
            var cmd = Common.SqlCommands[jcmd == null ? "WarGr" : jcmd.ToString()];
            if (string.IsNullOrEmpty(cmd))
                return null;
            if (jdata == null) jdata = "";
            cmd = string.Format(cmd, jdata);
            using (var reader = BaseRepository.ExecuteReaderEx("BAsket", cmd, null))
            //using (var reader = BaseRepository.ExecuteReaderEx("BAsket", "Select * From spWar where r_pwar=-8", null))
            {
                if (reader == null)
                    return null;

                while (reader.Read())
                {
                    result.Add(new Category()
                    {
                        /*
                        Id = reader.GetInt32("r_war").ToString(),
                        /*/
                        Id = reader.GetString("r_war"),
                        /**/
                        Name = reader.GetString("Name"),
                    });
                    //if (totalRows == 0) totalRows = reader.GetInt32("TotalRows");
                }
            }
            Common.AddCorsHeaders(HttpContext.Current.Response);
            return result;

            //var sout = JsonConvert.SerializeObject(result);

            //var qscb = qs["callback"];
            //HttpContext.Current.Response.Write(qscb + "(" + sout + ")");
//            HttpContext.Current.Response.Write(qs + "( [{}] )");
            //return result; 
            //return  "{id:1110, name:'getvalue'}";
            //return new string[] { "getvalue1", "getvalue2" };
            //return new List<Category>() { new Category() { CategoryID = "0", CategoryName = "" } };
        }
        
        //public class SpWarConverter : CustomCreationConverter<SpWar>
        //{
        //    public override SpWar Create(Type objectType)
        //    {
        //        return new SpWar();
        //    }
        //}
        //public void pcallback(){}
        #region other rest's

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        /*
            // POST api/values
        //public IEnumerable<SpWar> Post([FromBody]string value)
        [HttpPost]
        public IEnumerable<SpWar> Post(JObject jsonData)
        //public string Post(JObject jsonData)
        {
            dynamic json = jsonData;
            var jcmd = json["cmd"];
            var jdata = json["data"];
            var jusr  = json["usr"];

            var cmd = "";
            if (jcmd != null)
                cmd = sqlCommands[jcmd.ToString()];
            if (cmd == null)
                return null;
            if (jdata == null) jdata = "";
            cmd = string.Format(cmd, jdata);
            var result = new List<SpWar>();
//            using (var reader = BaseRepository.ExecuteReaderEx("BAsket", cmd, null))
            using (var reader = BaseRepository.ExecuteReaderEx("BAsket",
                string.Format("Select * From spWar where r_pwar={0}", -8), null))
            {
                while (reader.Read())
                {
                    result.Add(new SpWar()
                    {
                        //Id = reader.GetInt32("r_war"),
                        Id = reader.GetString("r_war"),
                        Name = reader.GetString("Name")
                       // Price = reader.GetDecimal("Price").ToString()
                    });
                    //if (totalRows == 0) totalRows = reader.GetInt32("TotalRows");
                }
            }
            return result; 
            //return  "{ postvalue1:1 }";
        }
        /**/

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
        /**/
        #endregion
    }


}