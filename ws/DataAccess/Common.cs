using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading;
using System.Web;
using BAsketWS.Helpers;
using BAsketWS.Models;

namespace BAsketWS.DataAccess
{
	[Export]
	[PartCreationPolicy(CreationPolicy.NonShared)]
    public class Common
    {
		[Import]
		private IBAsketPlugin mPlugin;
		public Common()
		{
			if (mPlugin == null) mPlugin = new DefaultPlugin();
		}

	    static Timer stockCheckTimer;
	    static DateTime dtStockChange;
		public static string StockFileName = "";
		static string dirTemp = "";

		public const string SProdTable = "bas_spProducts";
		public const string SCliTable = "bas_spClients";
		public const string SwuTable = "bas_WebUsers";
		public const string SBilTable = "bas_BilDocs";
		public const string SBasketProc = "bas_BAsketStuff";
		//public const string SWUTable = "sy_WebUsers";
		//public const string SWarTable = "bas_spWar";
		//public const string SCliTable = "bas_spCli";

		#region Utils

		public static List<T> ProcessCommand<T>(string cmd, Func<DataReaderAdapter, T> func)
		{
			AddCorsHeaders();
			var result = new List<T>();
			using (var reader = BaseRepository.ExecuteReaderEx(cmd))
			{
				if (reader == null)
					return null;
				while (reader.Read())
				{
					result.Add(func(reader));
				}
			}
			return result;
		}

		static public void AddCorsHeaders()
	    {
		    var res = HttpContext.Current.Response;

            var req = HttpContext.Current.Request.Headers;
	        if (req["Origin"] == null)
	        {
				res.Headers.Add("Access-Control-Allow-Origin", "*");
		        //SaveLog("*** Common (Access-Control-Allow-Origin) Origin not found");
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

		public void TimerConfig()
		{
			var sfn = ConfigurationManager.AppSettings["StockFileName"];
			var scm = ConfigurationManager.AppSettings["StockCheckInMin"];
			var iscm = 0;
			if (string.IsNullOrEmpty(sfn) || string.IsNullOrEmpty(scm) || !int.TryParse(scm, out iscm) || iscm < 1)
				return;

			StockFileName = GetRootDir() + sfn;
			if (File.Exists(StockFileName))
			{
				var fi = new FileInfo(StockFileName);
				dtStockChange = fi.LastWriteTime;
			}
			TimerCallback tcb = CheckPriceStatus;
			stockCheckTimer = new Timer(tcb, null, 5000, iscm * 1000 * 60);
		}

		void CheckPriceStatus(object stateInfo)
	    {
			if (File.Exists(StockFileName))
			{
				Common.SaveLog("CheckPriceStatus");

				var fi = new FileInfo(StockFileName);
				if (!dtStockChange.Equals(fi.LastWriteTime))
				{
					dtStockChange = fi.LastWriteTime;
					UpdateStock();
				}
			}
	    }

	    void UpdateStock()
	    {
			//Common.SaveLog("UpdateStock");
		    mPlugin.UpdateDbFromSwapFile();
	    }

	    static public string GetRootDir()
	    {
		    if (!string.IsNullOrEmpty(dirTemp))
			    return dirTemp;

		    var sDir = "C:\\Temp\\";
			try
			{
				if (HttpContext.Current != null && HttpContext.Current.Request != null &&
					HttpContext.Current.Request.PhysicalApplicationPath.Length > 0)
					dirTemp = sDir = HttpContext.Current.Request.PhysicalApplicationPath;
			}
			catch
			{
				if (HttpContext.Current != null)
					foreach (DictionaryEntry ckey in HttpContext.Current.Cache)
					{
						if (ckey.Key.ToString().StartsWith("__System.Web.WebPages.Deployment"))
						{
							dirTemp = sDir = ckey.Value.ToString();
						}
					}
			}
		    return sDir;
	    }

        static public void SaveLog(string sLog)
        {
			var sFN = GetRootDir() + "BAsketWS.log";
	        DateTime dt = DateTime.Now;
            string sOut = String.Format("\n{0}.{1}.{2} {3}:{4}:{5}| {6}", dt.Day.ToString("D2"), dt.Month.ToString("D2"), (dt.Year - 2000).ToString("D2"), dt.Hour.ToString("D2"), dt.Minute.ToString("D2"), dt.Second.ToString("D2"), sLog);
            Trace.WriteLine(sOut);
            Console.Write(sOut);
            Encoding encoding = Encoding.Default;
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
		#endregion

		#region CreateDbObject

		static public void CreateDbObject(string message, string table = "")
        {
	        if (String.IsNullOrEmpty(table))
	        {
				var sV = message.Replace("\"", "'").Split('\'');
		        if (sV.Length > 2)
			        table = sV[1];

	        }
			if (sqlCreateCommands.ContainsKey(table))
			{
				var cmd = String.Format(sqlCreateCommands[table], table);
				if (!String.IsNullOrEmpty(cmd))
				{
					BaseRepository.ExecuteCommand("BAsket", cmd, null);
				}
			}
			else
	        {
				SaveLog("CreateDbObject: key not found: " + table);
			}
        }

        static Dictionary<string, string> sqlCreateCommands = new Dictionary<string, string>()
        {
            {SwuTable, "CREATE TABLE [dbo].{0}("+
					"Id int IDENTITY(1,1) primary key"+
					",Name varchar(50)"+
					",NameID varchar(50)"+
					",EMail varchar(50)"+
					//",[SelCli] [varchar](500)"+
					//",[SelSup] [varchar](500)"+
					//",[SelWar] [varchar](500)"+
					//",N_TP smallint"+
					")"
			},
            {SProdTable, "Create table dbo.{0} (" +
                    "Id varchar(10) primary key," +
                    "IdP varchar(10)," +
                    "N varchar(250)," +
                    "N1 varchar(250)," +
                    "N2 varchar(250)," +
                    "N3 varchar(250)," +
                    "N4 varchar(250)," +
                    "N5 varchar(250)," +
                    "O int," +
                    "P money," +
                    "isWare bit)" +
                    ";Create Index IX_war_hwar On {0}(IdP)" + 
                    ";Create Index IX_war_name On {0}(N)" +
					""
            },
            {SCliTable, "CREATE TABLE [dbo].{0}("+
					"Id varchar(10) primary key,"+
					"IdP varchar(10),"+
					"N varchar(250),"+
					"A varchar(250))"
            },
			{SBilTable, "CREATE TABLE [dbo].{0}("+
					"Id varchar(10) primary key,"+
					"IdC varchar(10),"+
					"IdT varchar(10),"+
					"IdP1 varchar(10),"+
					"IdP2 varchar(10),"+
					"IdLoc int,"+
					"IdUser int,"+
					"DateDoc datetime,"+
					"SumDoc money,"+
					"Note varchar(250),"+
					"Wars varchar(8000))"+
                    ";Create Index IX_bil_cli On {0}(IdC)" + 
                    ";Create Index IX_bil_tch On {0}(IdT)" +
					""
            },
        };
        #endregion

    }

	public interface IBAsketPlugin
	{
		List<Nms> GetNms();
		List<Category> GetCategories();

		List<Client> GetClients();
		List<Client> GetClientsById(string id);
	
		List<Product> GetProducts();
		Product GetProductById(string id);
		List<ProdStock> GetProdStock();

		List<BilM> GetBilM();
		BilM GetBilMById(string id);
		BilM PostBilM();

		void UpdateDbFromSwapFile();
	}
}


//static public Dictionary<string, string> SqlCommands = new Dictionary<string, string>()
//	{
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
//		{"WarsByGId", "Select * FROM (Select Row_Number() OVER (ORDER BY [N] ASC) as rowNum, * From " + SWarTable + " Where IdP='{0}' {1})x Where rowNum > {2} and rowNum <= {2}+{3}"},

//		{"WarById", "Select * from " + SWarTable + " Where Id='{0}'"},
//		{"War", "Select * from " + SWarTable + " Where isware=1 and len(N)>1 and O>0 Order by N"},

//		{"WarGr", "Select * from " + SWarTable + " Where IdP=0"},

//		{"Cli", "Select * FROM (Select Row_Number() OVER (ORDER BY [N] ASC) as rowNum, * From " +SCliTable+ " Where N is not null and A is not null and IdP is null {0})x Where rowNum > {1} and rowNum <= {1}+{2} Order by N"},
///**/
//		{"CliFil", "Select * From " + SCliTable + " Where N is not null and A is not null and IdP='{0}' Order by N"},
//		{"CliById", "Select c.*, par.N as PN, ISNULL(par.N + ' - ' + c.N, c.N) as FN From " + SCliTable + " c Left Join " + SCliTable + " par On c.IdP=par.Id Where c.Id='{0}'"},
//		{"CliAll", "Select * From " + SCliTable + " Where N is not null and A is not null Order by N"},

//		{"Nms", "Select 0 as IdP, 1 as Id, 'Предприятие' as N Union " +
//				"Select 0 as IdP, 101 as Id, 'Отчет' as N Union " +
//				"Select 1 as IdP, 1 as Id, 'Нормаль ООО' as N Union " +
//				"Select 101 as IdP, 1 as Id, 'Отчет 1' as N " +
//				"Order by IdP, Id"},

//		{"BilMSave", "exec _BasketStuff 1, '{0}', @Reply output"},

//		{"WebUsers", "Select * From " + SWUTable},
//	};

//public static string GetSqlCommand(string cmd, IBAsketPlugin mPlugin)
//{
//	var ret = mPlugin == null ? SqlCommands[cmd] : mPlugin.GetSqlCommand(cmd);
//	return ret;
//}

//public static Dictionary<string, string> Names = new Dictionary<string, string>()
//	{
//		{"ID", "r_war"},
//		{"Upak", "ostat"}
//	};
//static public string GetName(string name)
//{
//	var ret = (Names.Keys.Contains(name)) ? Names[name] : name;
//	return ret;
//}
