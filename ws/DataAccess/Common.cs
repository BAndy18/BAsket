using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
//using System.ComponentModel.Composition;

namespace BAsketWS.DataAccess
{
    public class Common
    {
        static public void AddCorsHeaders(HttpResponse res)
        {
            var req = HttpContext.Current.Request.Headers;
	        if (req["Origin"] == null)
	        {
				res.Headers.Add("Access-Control-Allow-Origin", "*");
		        Common.SaveLog("*** Common (Access-Control-Allow-Origin) Origin not found");
	        }
	        else
		        res.Headers.Add("Access-Control-Allow-Origin", req["Origin"]);
	        //res.Headers.Add("Access-Control-Allow-Origin", "http://192.168.1.146:3000");
            //res.Headers.Add("Access-Control-Allow-Origin", "*");
            res.Headers.Add("Access-Control-Allow-Credentials", "true");
            res.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
            //res.Headers.Add("Access-Control-Allow-Headers", "*");   //"Origin, X-Requested-With, Content-Type, Accept, Authorization");
            //res.Headers.Add("Access-Control-Allow-Headers", "Accept, Authorization");
        }

		static public Dictionary<string, string> SqlCommands = new Dictionary<string, string>()
            {
		/*
                //{"WarsByGId", "Select * FROM (Select Row_Number() OVER (ORDER BY [name] ASC) as rowNum, * from spWar Where isware=1 and bSusp=0 and Price > 0 and r_hwar={0} {1})x Where rowNum > {2} and rowNum <= {2}+{3}"},
                {"WarsByGId", "exec _BasketPaging 1, {0}, {1}, {2}, {3}"},
                {"WarById", "Select * From spWar Where r_war={0} "},
                {"War", "Select * From spWar Where isware=1 and bSusp=0 and Price > 0 and Ostat > 0 and r_hwar is not null and r_hwar not in (-182,18801,14967,15003) Order by Name"},
                {"WarGr", "Select * From spWar Where r_pwar=0 and r_war not in (-182,18801,14967,15003) Order by Name"},

                //{"Cli", "Select * FROM (Select Row_Number() OVER (ORDER BY [name] ASC) as rowNum, * from spCli Where n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 and r_fcli is null {0})x Where rowNum > {1} and rowNum <= {1}+{2} Order by Name"},
                {"Cli", "exec _BasketPaging 2, 0, {0}, {1}, {2}"},
                {"CliFil", "Select * From spCli Where n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 and r_fcli={0} Order by Name"},
                {"CliById", "Select c.*, par.Name as ParName, ISNULL(par.Name + ' - ' + c.Name, c.Name) as FullName From spCli c Left Join spCLI par On c.r_fcli=par.r_cli Where c.r_cli={0}"},
                {"CliAll", "Select * From spCli Where n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 Order by Name"},

                //{"BilM", "Select b.*, c.Name as cName, t.Name as tName, ISNULL(c.Name + ' - ' + t.Name, c.Name) as FullName, ISNULL(t.Adres, c.Adres) as AdresDost From Bil b Join spCLI c On c.r_cli=b.r_cli Left Join spCLI t On t.r_cli=b.r_fcli Where b.N_TP={0} and datediff(day, Datedoc, getdate())<20 Order by DateDoc desc"},
                {"BilM", "exec _BasketPaging 3, {0}, {1}, {2}, {3}"},
                {"BilMById", "Select b.*, c.Name as cName, t.Name as tName, ISNULL(c.Name + ' - ' + t.Name, c.Name) as FullName, ISNULL(t.Adres, c.Adres) as AdresDost From Bil b Join spCLI c On c.r_cli=b.r_cli Left Join spCLI t On t.r_cli=b.r_fcli Where r_bil={0}"},
                {"BilMSave", "exec _BasketStuff 1, '{0}', @Reply output"},

            
		/*/
		// Нормаль данные
				{"WarsByGId", "Select * FROM (Select Row_Number() OVER (ORDER BY [name] ASC) as rowNum, * from bas_spWar Where r_hwar={0} {1})x Where rowNum > {2} and rowNum <= {2}+{3}"},

				{"WarById", "Select * from bas_spWar Where r_war={0} "},
				{"War", "Select * from bas_spWar Where isware=1 and len(Name)>1 and Ostat>0 Order by Name"},

				{"WarGr", "Select * from bas_spWar Where r_hwar=0"},

				{"Cli", "Select * FROM (Select Row_Number() OVER (ORDER BY [name] ASC) as rowNum, * from spCli Where n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 and r_fcli is null {0})x Where rowNum > {1} and rowNum <= {1}+{2} Order by Name"},
        /**/
                {"CliAll", "Select * From spCli Where n_tcli=1 and name is not null and adres is not null and ascii(left(adres,1))>0 Order by Name"},

				{"Nms", "Select 0 as t_nms, 1 as n_nms, 'Предприятие' as Name Union " +
						"Select 0 as t_nms, 101 as n_nms, 'Отчет' as Name Union " +
						"Select 1 as t_nms, r_sup as n_nms, Name From spSUP Where Npp>0 Union " +
						"Select 101 as t_nms, fkey as n_nms, ltrim(rtrim(p.Name)) as Name From sy_PRN p Where bSusp=0 and NView<10 and NView>=0 and left(p.Name,2)<>'+ ' and left(p.Name,2)<>'--'   and p.fkey in (21,40, 78,79, 351, 454,455, 350) Union " +
						"Select t_nms, n_nms, Name From spNMS Where bSusp=0 and N_NMS in (2) and T_NMS=0 Union " +
						"Select t_nms, n_nms, Name From spNMS Where bSusp=0 and T_NMS in (2) " +
						"Order by t_nms, n_nms"},

                {"BilMSave", "exec _BasketStuff 1, '{0}', @Reply output"},

				{"WebUsers", "Select * from sy_WebUsers"},
			};

		public static Dictionary<string, string> Names = new Dictionary<string, string>()
            {
                {"ID", "r_war"},
                {"Upak", "ostat"}
            };
        static public string GetName(string name)
        {
            var ret = (Names.Keys.Contains(name)) ? Names[name] : name;
            return ret;
        }


        static public void SaveLog(string sLog)
        {
            var sFN = "C:\\BAsketWS.log";
	        try
	        {
		        if (HttpContext.Current != null && HttpContext.Current.Request != null &&
		            HttpContext.Current.Request.PhysicalApplicationPath.Length > 0)
			        sFN = HttpContext.Current.Request.PhysicalApplicationPath + "BAsketWS.log";
	        }
	        catch
	        {
				if (HttpContext.Current != null)
				foreach (System.Collections.DictionaryEntry ckey in HttpContext.Current.Cache)
		        {
					if (ckey.Key.ToString().StartsWith("__System.Web.WebPages.Deployment"))
					{
						sFN = ckey.Value.ToString() + "BAsketWS.log";
					}
		        }
	        }
	        DateTime dt = DateTime.Now;
            string sOut = String.Format("\n{0}.{1}.{2} {3}:{4}:{5}| {6}", dt.Day.ToString("D2"), dt.Month.ToString("D2"), (dt.Year - 2000).ToString("D2"), dt.Hour.ToString("D2"), dt.Minute.ToString("D2"), dt.Second.ToString("D2"), sLog);
            System.Diagnostics.Trace.WriteLine(sOut);
            Console.Write(sOut);
            System.Text.Encoding encoding = System.Text.Encoding.Default;
			try
	        {
				using (FileStream fs = File.Open(sFN, FileMode.OpenOrCreate, FileAccess.Write, FileShare.Read))
				{
					fs.Seek(0, SeekOrigin.End);
					byte[] info = encoding.GetBytes(sOut.ToCharArray());
					fs.Write(info, 0, info.Length);
				}
			}
			catch
			{
			}
        }

		#region CreateDbObject
		static public void CreateDbObject(string message, string table = "")
        {
	        if (string.IsNullOrEmpty(table))
	        {
				var sV = message.Split('\'');
		        if (sV.Length > 2)
			        table = sV[1];

	        }
			var cmd = string.Format(sqlCreateCommands[table], table);
            if (!string.IsNullOrEmpty(cmd))
            {
                BaseRepository.ExecuteCommand("BAsket", cmd, null);
            }
        }

        static Dictionary<string, string> sqlCreateCommands = new Dictionary<string, string>()
        {
            {DbfHelper.SWarTable, "Create table dbo.{0} (" +
                        "r_war varchar(10) primary key," +
                        "r_hwar varchar(10)," +
                        "name varchar(250)," +
                        "name_c varchar(250)," +
                        "name_manuf varchar(250)," +
                        "name_pict varchar(250)," +
                        "ostat int," +
                        "price money," +
                        "datedit smalldatetime default getdate()," +
                        "isware bit)" +
                        ";Create Index IX_war_hwar On {0}(r_hwar)" + 
                        ";Create Index IX_war_name On {0}(name)" + 
                        ""},
            //{"getWarsByGId", "Select * from spWar Where r_hwar={0}"},
            //{"getWarById", "Select * from spWar Where r_war={0}"},
        };
        #endregion
    }
}