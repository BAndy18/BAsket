using System.Collections.Generic;
using System.Web;
using System.Web.Http;
using BAsketWS.DataAccess;
using BAsketWS.Models;

namespace BAsketWS.Controllers
{
	public class ProdOstController : ApiController
    {
		public List<ProdOst> Get()
        {
            var qs = HttpContext.Current.Request.QueryString;
            var grId = qs["grId"];
            var cmd = Common.SqlCommands["War"];

			var result = new List<ProdOst>();
            using (var reader = BaseRepository.ExecuteReaderEx(cmd))
            {
                if (reader == null)
                    return null;
                while (reader.Read())
                {
					result.Add(new ProdOst()
                        {
                            /*
                            Id = reader.GetInt32(Common.GetName("r_war")).ToString(),
                            O = reader.GetFloat(Common.GetName("Ostat")).ToString(),
                            /*/
                            Id = reader.GetString(Common.GetName("r_war")),
                            O = reader.GetInt32(Common.GetName("Ostat")).ToString(),
                            /**/
                        });
                }
            }
            Common.AddCorsHeaders(HttpContext.Current.Response);
            return result;
        }
    }
}