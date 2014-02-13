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
		static string dirRoot = "";
		const string DirMessages = "messages\\";
		public const string DirMessagesOut = "messages\\outbox\\";

		public const string SNmsTable = "bas_spNames";
		public const string SProdTable = "bas_spProducts";
		public const string SCliTable = "bas_spClients";
		public const string SwuTable = "bas_WebUsers";
		public const string SRoadTable = "bas_RoadMaps";
		public const string SBilTable = "bas_BilDocs";
		public const string SBasketProc = "bas_BAsketStuff";
		//public const string SWUTable = "sy_WebUsers";
		//public const string SWarTable = "bas_spWar";
		//public const string SCliTable = "bas_spCli";

		#region Utils

		public static List<T> ProcessCommand<T>(string cmd, Func<DataReaderAdapter, T> func)
		{
			return ProcessCommand("BAsket", cmd, func);
		}
		public static List<T> ProcessCommand<T>(string connect, string cmd, Func<DataReaderAdapter, T> func)
		{
			AddCorsHeaders();
			var result = new List<T>();
			using (var reader = BaseRepository.ExecuteReaderEx(connect, cmd, null))
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

		static public IBAsketPlugin PluginInit(IBAsketPlugin mPlugin)
		{
			if (mPlugin == null) return new DefaultPlugin();
			return mPlugin;
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
			StockFileName = GetRootDir() + DirMessages + sfn;
			var iscm = 0;
			if (string.IsNullOrEmpty(sfn) || string.IsNullOrEmpty(scm) || !int.TryParse(scm, out iscm) || iscm < 1)
				return;

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
		    if (!string.IsNullOrEmpty(dirRoot))
			    return dirRoot;

		    var sDir = "C:\\Temp\\";
			try
			{
				if (HttpContext.Current != null && HttpContext.Current.Request != null &&
					HttpContext.Current.Request.PhysicalApplicationPath.Length > 0)
					dirRoot = sDir = HttpContext.Current.Request.PhysicalApplicationPath;
			}
			catch
			{
				if (HttpContext.Current != null)
					foreach (DictionaryEntry ckey in HttpContext.Current.Cache)
					{
						if (ckey.Key.ToString().StartsWith("__System.Web.WebPages.Deployment"))
						{
							dirRoot = sDir = ckey.Value.ToString();
						}
					}
			}
		    return sDir;
	    }

		static public List<DateTime> GetDateRecList(string sRec)
		{
			var lRet = new List<DateTime>();
			var dt = DateTime.Now;
			var dV = sRec.Split(';');
			if (dV.Length > 1)
			{
				lRet.Add(dt);
			}
			else
			{
				if (DateTime.TryParse(sRec, out dt))
					lRet.Add(dt);
			}

			return lRet;
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
			var cmd = "";
	        if (String.IsNullOrEmpty(table))
	        {
				var sV = message.Replace("\"", "'").Split('\'');
		        if (sV.Length > 2)
			        table = sV[1];

	        }
			if (table == SwuTable)
			{
				var app = "if exists (select * from dbo.sysobjects where id = object_id(N'[dbo].[{0}]')) drop table [dbo].[{0}];";
				foreach (var key in sqlCreateCommands.Keys)
				{
					if (key == SBasketProc)
					{
						cmd = String.Format(app.Replace("table", "procedure"), key);
						BaseRepository.ExecuteCommand(cmd);
						cmd = String.Format(sqlCreateCommands[key], key, SBilTable);
					}
					else
						cmd = String.Format(app + sqlCreateCommands[key], key);
					BaseRepository.ExecuteCommand(cmd);
				}
				return;
			}
				
			if (sqlCreateCommands.ContainsKey(table))
			{
				cmd = String.Format(sqlCreateCommands[table], table);
				if (!String.IsNullOrEmpty(cmd))
				{
					BaseRepository.ExecuteCommand(cmd);
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
					",Name nvarchar(50)"+
					",NameID nvarchar(50)"+
					",EMail nvarchar(50)"+
					//",[SelCli] [varchar](500)"+
					//",[SelSup] [varchar](500)"+
					//",[SelWar] [varchar](500)"+
					//",N_TP smallint"+
					")" +
					";Insert Into {0} (Name) Values(N'BAsket User')" +
					""
			},
	        {SNmsTable, "Create table dbo.{0} (" +
                    "IdP int not null," +
                    "Id int not null," +
                    "N nvarchar(250) not null)" +
					";Insert Into {0} (IdP,Id,N) Values(0,1,N'Предприятие')" +
					";Insert Into {0} (IdP,Id,N) Values(0,10,N'Product Properties')" +
					";Insert Into {0} (IdP,Id,N) Values(0,20,N'Client Properties')" +
					";Insert Into {0} (IdP,Id,N) Values(0,101,	N'Reports')" +
					";Insert Into {0} (IdP,Id,N) Values(1,1,	N'BAsket ООО')" +
					";Insert Into {0} (IdP,Id,N) Values(10,1,	N'Упаковка')" +
					";Insert Into {0} (IdP,Id,N) Values(10,2,	N'Производитель')" +
					""
	        },
            {SProdTable, "Create table dbo.{0} (" +
                    "Id varchar(10) primary key," +
                    "IdP varchar(10) not null," +
                    "N nvarchar(250) not null," +
                    "N1 nvarchar(250)," +
                    "N2 nvarchar(250)," +
                    "N3 nvarchar(250)," +
                    "N4 nvarchar(250)," +
                    "O int," +
                    "P money," +
                    "isWare bit)" +
                    ";Create Index IX_prod_p On {0}(IdP)" + 
                    ";Create Index IX_prod_n On {0}(N)" +
					""
            },
            {SCliTable, "CREATE TABLE [dbo].{0}("+
					"Id varchar(10) primary key,"+
					"IdP varchar(10) not null,"+
					"N nvarchar(250) not null,"+
                    "N1 nvarchar(250)," +
                    "N2 nvarchar(250)," +
					"A nvarchar(250) not null)"+
					";Create Index IX_cli_p On {0}(IdP)" + 
                    ";Create Index IX_cli_n On {0}(N)" +
					""
            },
			{SRoadTable, "CREATE TABLE [dbo].{0}("+
					"Id int IDENTITY(1,1) primary key,"+
					"IdUser int not null,"+
					"DateRM datetime not null,"+
					"Npp int not null,"+
					"IdC varchar(10) not null,"+
					"IdT varchar(10),"+
                    "P1 nvarchar(250)," +
                    "P2 nvarchar(250)," +
					"Note nvarchar(250))"+
                    ";Create Index IX_road_u On {0}(IdUser)" + 
                    ";Create Index IX_road_d On {0}(DateRM)" + 
                    ";Create Index IX_road_c On {0}(IdC)" + 
                    ";Create Index IX_road_t On {0}(IdT)" + 
					""
            },
			{SBilTable, "CREATE TABLE [dbo].{0}("+
					"Id int IDENTITY(1,1) primary key,"+
					"IdC varchar(10) not null,"+
					"IdT varchar(10),"+
					"IdUser int,"+
					"LocNum int,"+
					"NumDoc varchar(50),"+
					"DateDoc datetime not null,"+
					"SumDoc money,"+
                    "P1 nvarchar(250)," +
                    "P2 nvarchar(250)," +
                    "P3 nvarchar(250)," +
                    "P4 nvarchar(250)," +
					"Note nvarchar(250),"+
					"Wars varchar(8000))"+
                    ";Create Index IX_bil_c On {0}(IdC)" + 
                    ";Create Index IX_bil_t On {0}(IdT)" +
					""
            },
	        {SBasketProc, 
@"CREATE Procedure [dbo].[{0}]
	@Key int, @Param nvarchar(4000) = '', @Reply nvarchar(100)  OUTPUT 
As
DECLARE @i int, @id int, @start int, @token nvarchar(4000), @NumDoc nvarchar(4000), 
	@P0 nvarchar(100), @P1 nvarchar(100), @P2 nvarchar(100), @P3 nvarchar(100), @P4 nvarchar(100), @P5 nvarchar(100), @P6 nvarchar(100), @P7 nvarchar(100), @P8 nvarchar(100), @P9 nvarchar(100),
	@I1 int, @D1 money

if (@Key = 1) -- Bil Save
begin
	set @i = -1
	while CHARINDEX('|', @Param) > 0
	begin
		set @i = @i + 1
		SELECT @start = CHARINDEX('|', @Param)
		SELECT @token = SUBSTRING(@Param, 0, @start)
		SELECT @Param = SUBSTRING(@Param, @start + 1, len(@Param) - @start)
		if @i = 0 set @P0 = @token else
		if @i = 1 set @P1 = @token else
		if @i = 2 set @P2 = @token else
		if @i = 3 set @P3 = @token else
		if @i = 4 set @P4 = @token else
		if @i = 5 set @P5 = @token else
		if @i = 6 set @P6 = @token else
		if @i = 7 set @P7 = @token else
		if @i = 8 set @P8 = @token else
		if @i = 9 set @P9 = @token 
	end
	if @P4 = '0'
		set @P4 = null
	if len(@P0) = 0 -- ID of new Bil 
	begin
		Insert {1}(IdUser,DateDoc, IdC,IdT, Note,LocNum, SumDoc, Wars, P1)
		Select @P1, CONVERT(DateTime, @P2, 105), @P3,@P4, @P5, @P6, @P7, @P8, @P9
		set @id = @@IDENTITY
		
		--if @P6=0 
		set @P6='# ' + ltrim(str(@id))
		Update {1} set NumDoc=@P6 Where Id=@id

		set @Reply = ltrim(str(@id)) + ' Insert'
	end else begin
		set @id = @P0
		
		--Select @I1 = r_stad, @D1 = SumInv From Bil Where r_bil=@id
		if 1=0 and (@I1 > 50 or @D1 > 0) -- ReadOnly condition
		begin
			set @Reply = 'Bil is ReadOnly, edit canceled'
			return
		end
		
		Update {1} set DateDoc=CONVERT(DateTime, @P2, 105), IdC=@P3,IdT=@P4,  Note=@P5, SumDoc=@P7, Wars=@P8,P1=@P9
		Where Id=@id

		set @Reply = ltrim(str(@id)) + ' Edit'
	end
	
	return
end
"
	        }
        };
        #endregion

		public static void ReadTest(IBAsketPlugin mPlugin)
		{
			//return;
			CreateDbObject(SwuTable, SwuTable);
			//Common.CreateDbObject(Common.SProdTable, Common.SProdTable);
			//Common.CreateDbObject(Common.SCliTable, Common.SCliTable);

			var cmd = "SELECT -CategoryID as CategoryID,[CategoryName] FROM [Northwind].[dbo].[Categories]";
			cmd = "SELECT [ProductID],[ProductName],s.[CompanyName],-CategoryID as CategoryID,[QuantityPerUnit],[UnitPrice],[UnitsInStock]FROM [Northwind].[dbo].[Products] p Join [Suppliers] s On p.[SupplierID]=s.[SupplierID]";
			cmd = "SELECT [CustomerID],[CompanyName],[Address]+', '+[City]+', '+[PostalCode]+', '+[Country] as [Address] FROM [Northwind].[dbo].[Customers]";

			//			var result = Common.ProcessCommand("Northwind", cmd, reader => new Category
			//			var result = Common.ProcessCommand("Northwind", cmd, reader => new Product
			var result = Common.ProcessCommand("Northwind", cmd, reader => new Client
			{
				/*
				//	Category
				Id = reader.GetStrValue("CategoryID"),
				N = reader.GetStrValue("CategoryName"),
				/* /
				// Product
				Id = reader.GetStrValue("ProductID"),
				IdP = reader.GetStrValue("CategoryID"),
				N = reader.GetStrValue("ProductName"),
				//N1 = reader.GetStrValue("N1"), //NameArt
				N2 = reader.GetStrValue("CompanyName"), //NameManuf
				//N3 = reader.GetStrValue("N3"), //UrlPict - Name_pict
				N4 = reader.GetStrValue("QuantityPerUnit"), //Upak 
				O = reader.GetStrValue("UnitsInStock"),
				P = reader.GetDecimal("UnitPrice"),
				/*/
				// Client
				Id = reader.GetStrValue("CustomerID"),
				//IdP = reader.GetStrValue("CategoryID"),
				N = reader.GetStrValue("CompanyName"),
				//N1 = reader.GetStrValue("N1"),
				A = reader.GetStrValue("Address"),
				/**/
			});
			//XmlHelper.XmlOut(result);

			mPlugin.UpdateDbFromSwapFile();
		}

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

		List<Bil> GetBil();
		Bil GetBilById(string id);
		Bil PostBil();

		List<RoadMap> GetRoadMap();
		//RoadMap GetRoadMapById(string id);

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

		//{"Bil", "Select b.*, c.Name as cName, t.Name as tName, ISNULL(c.Name + ' - ' + t.Name, c.Name) as FullName, ISNULL(t.Adres, c.Adres) as AdresDost From Bil b Join spCLI c On c.r_cli=b.r_cli Left Join spCLI t On t.r_cli=b.r_fcli Where b.N_TP={0} and datediff(day, Datedoc, getdate())<20 Order by DateDoc desc"},
		{"Bil", "exec _BasketPaging 3, {0}, {1}, {2}, {3}"},
		{"BilById", "Select b.*, c.Name as cName, t.Name as tName, ISNULL(c.Name + ' - ' + t.Name, c.Name) as FullName, ISNULL(t.Adres, c.Adres) as AdresDost From Bil b Join spCLI c On c.r_cli=b.r_cli Left Join spCLI t On t.r_cli=b.r_fcli Where r_bil={0}"},
		{"BilSave", "exec _BasketStuff 1, '{0}', @Reply output"},

            
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

//		{"BilSave", "exec _BasketStuff 1, '{0}', @Reply output"},

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
