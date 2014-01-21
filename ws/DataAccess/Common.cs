using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml;
using System.Xml.Linq;
//using System.ComponentModel.Composition;

namespace BAsketWS.DataAccess
{
    public class Common
    {
        static public void AddCorsHeaders(HttpResponse res)
        {
            var req = HttpContext.Current.Request.Headers;
            if (req["Origin"] != null)
                res.Headers.Add("Access-Control-Allow-Origin", req["Origin"]);
            //res.Headers.Add("Access-Control-Allow-Origin", "http://192.168.1.146:3000");
            //res.Headers.Add("Access-Control-Allow-Origin", "*");
            res.Headers.Add("Access-Control-Allow-Credentials", "true");
            //res.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
            //res.Headers.Add("Access-Control-Allow-Headers", "*");   //"Origin, X-Requested-With, Content-Type, Accept, Authorization");
            res.Headers.Add("Access-Control-Allow-Headers", "Accept, Authorization");
        }

        static public Dictionary<string, string> SqlCommands = new Dictionary<string, string>()
            {
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

                {"Nms", "Select 0 as t_nms, 1 as n_nms, 'Предприятие' as Name Union " +
                    "Select 1 as t_nms, r_sup as n_nms, Name From spSUP Where Npp>0 Union " +
                    "Select t_nms, n_nms, Name From spNMS Where bSusp=0 and N_NMS in (-1) and T_NMS=0 Union " +
                    "Select t_nms, n_nms, Name From spNMS Where bSusp=0 and T_NMS in (-1) " +
                    "Order by t_nms, n_nms"},

                //{"BilM", "Select b.*, c.Name as cName, t.Name as tName, ISNULL(c.Name + ' - ' + t.Name, c.Name) as FullName, ISNULL(t.Adres, c.Adres) as AdresDost From Bil b Join spCLI c On c.r_cli=b.r_cli Left Join spCLI t On t.r_cli=b.r_fcli Where b.N_TP={0} and datediff(day, Datedoc, getdate())<20 Order by DateDoc desc"},
                {"BilM", "exec _BasketPaging 3, {0}, {1}, {2}, {3}"},
                {"BilMById", "Select b.*, c.Name as cName, t.Name as tName, ISNULL(c.Name + ' - ' + t.Name, c.Name) as FullName, ISNULL(t.Adres, c.Adres) as AdresDost From Bil b Join spCLI c On c.r_cli=b.r_cli Left Join spCLI t On t.r_cli=b.r_fcli Where r_bil={0}"},
                {"BilMSave", "exec _BasketStuff 1, {0}, '{1}'"},

                {"WebUsers", "Select * from sy_WebUsers"},
            };

            /* Нормаль данные
            {
                {"WarsByGId", "Select * FROM (Select Row_Number() OVER (ORDER BY [name] ASC) as rowNum, * from spWar1 Where r_hwar={0} {1})x Where rowNum > {2} and rowNum <= {2}+{3}"},

                {"WarById", "Select * from spWar1 Where r_war={0} "},
                {"War", "Select * from spWar1 Where isware=1 Order by Name"},

                {"WarGr", "Select * from spWar1 Where r_hwar=0"},
        
            };/**/

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

        static DateTime dtPriceUpdate;
        static string sPricePath = "d:\\price.dbf";
        static string sTable = "spWar1";

        static public void readDbf()
        {
            var iGrpId = GetLastGrpId();

            var grpNames = new Dictionary<string, string>();
            var fiTran = new Dictionary<string, string>() { { "code", "r_war" }, { "art", "name_c" }, { "group", "r_hwar" }, { "manufact", "name_manuf" }, { "pict", "name_pict" }, { "stock", "ostat" } };
            var cmd = "";

            var dbfCnct = new OleDbConnection(
                    "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + sPricePath.Substring(0, sPricePath.LastIndexOf("\\") + 1) + ";Extended Properties=dbase IV;");
                    //"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + sPricePath.Substring(0, sPricePath.LastIndexOf("\\") + 1) + ";Extended Properties=dBASE IV;");
            dbfCnct.Open();

            var dbfCmd = new OleDbCommand("Select * From " + sPricePath.Substring(sPricePath.LastIndexOf("\\") + 1), dbfCnct);
            var dbfReader = dbfCmd.ExecuteReader();
            if (dbfReader == null || !dbfReader.HasRows)
                return;
            var dbfTable = new DataTable();
            dbfTable.Load(dbfReader);

            bool isFirst = true;
            foreach (DataRow dr in dbfTable.Rows)
            //while (dbfReader.Read())
            {
                if (isFirst)
                {
                    isFirst = false;
                    continue;
                }
                var group = dr["group"].ToString();
                if (!grpNames.ContainsKey(group))
                {
                    var s = GetDbValue<string>(string.Format("select r_war from {0} where isware=0 and name='{1}'", sTable, group));
                    if (string.IsNullOrEmpty(s))
                    {
                        cmd = string.Format("Insert {0} (r_war,r_hwar,name,isware) values({1},0,'{2}',0)",
                                sTable, iGrpId, group);
                        var ret = BaseRepository.ExecuteCommand("BAsket", cmd, null);
                        grpNames[group] = iGrpId.ToString();
                        iGrpId--;
                    } else
                        grpNames[group] = s;
                }
                group = grpNames[group];

                cmd = string.Format("select * from {0} where r_war='{1}'", sTable, dr["code"]);
                using (var reader = BaseRepository.ExecuteReaderEx("BAsket", cmd, null))
                {
                    if (reader.Read())
                    {
                        // try update
                        //grpNames[val] = reader.GetString("r_war").ToString();
                    }
                    else
                    {
                        //insert new
                        var stock = dr["stock"].ToString() == "True" ? 1 : 0;
                        var price = dr["price"].ToString().Replace(",", ".");
                        cmd = string.Format(
                                "Insert {0} (r_war,r_hwar,name,name_c,name_manuf,name_pict,ostat,price,isware)" +
                                " values('{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}', 1)",
                                sTable, dr["code"], group, dr["name"],
                                dr["art"], dr["manufact"], dr["pict"],
                                stock, price);
                        try
                        {
                            var ret = BaseRepository.ExecuteCommand("BAsket", cmd, null);
                        }
                        catch (Exception ex) { }
                    }
                }                
            }
            dbfCnct.Close();

            //string connectionString = @"Driver={Microsoft dBASE Driver (*.dbf)};DriverID=277;Dbq=price.dbf;";
            //connectionString =
            //    @"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=c:\folder;Extended Properties=dBASE IV;User ID=Admin;Password=;";
            //OleDbConnection dBaseConnection = new OleDbConnection(connectionString);
            //dBaseConnection.Open();

            //        OleDbDataAdapter dBaseAdapter = new OleDbDataAdapter("SELECT * FROM price", connectionString);
            //        DataSet dBaseDataSet = new DataSet();
            //            if (dBaseConnection == null || dBaseAdapter == null)
            //                return;
            //        dBaseAdapter.Fill(dBaseDataSet);//I get the error right here... 
            //        DataTable dBaseDataTable = dBaseDataSet.Tables[0];
            //        foreach (DataRow dr in dBaseDataTable.Rows)
            //        {
            ////            Console.WriteLine(dr["Customer"]);
            //        }         
        }

        static T GetDbValue<T>(string query)
        {
            T ret = default(T);
            using (var reader = BaseRepository.ExecuteReaderEx("BAsket", query, null))
            {
                try
                {
                    if (reader.Read())
                        ret = reader.GetValue(0, default(T));
                }
                catch (Exception ex)
                {
                    if (ex.Message.StartsWith("Invalid object"))
                        Common.CreateDbObject(ex.Message);
                }
            }
            return ret;
        }

        static int GetLastGrpId()
        {
            var iGrpId = GetDbValue<int>(string.Format("select min(cast(r_war as int)) as r_war from {0} where isware=0 and left(r_war,1)<>'.'", sTable));
            iGrpId--;
            return iGrpId;
/*            using (var reader = BaseRepository.ExecuteReaderEx("BAsket", cmd, null))
            {
                try
                {
                    if (reader.Read())
                    {
                        iGrpId = reader.GetInt32("r_war");
                        iGrpId--;
                    }
                }
                catch (Exception ex)
                {
                    if (ex.Message.StartsWith("Invalid object"))
                        Common.CreateDbObject(ex.Message);
                }
            }
            return iGrpId;*/
        }
      
        static public void CheckPriceStatus(Object stateInfo)
        {
            SaveLog("CheckPriceStatus");
            //if (File.Exists(sPricePath) && File.GetLastWriteTime(sPricePath) > dtPriceUpdate)
            {
                var iGrpId = GetLastGrpId();

                var grpNames = new Dictionary<string, string>();
                var fiTran = new Dictionary<string, string>()
                    {{"code","r_war"},{"art","name_c"},{"group","r_hwar"},{"manufact","name_manuf"},{"pict","name_pict"},{"stock","ostat"}};
                var cmd = "";

                var xml = XDocument.Load(sPricePath, LoadOptions.None);
                var xarray = xml.Element("HEAD").Nodes().ToList();
                int i = 1;
                while (i < xarray.Count()) 
                {
                    var el = xarray[i++] as XElement; 
                    var fi = el.FirstNode;
                    //var List
                    var warFields = new Dictionary<string, string>();
                    do
                    {
                        var val = (fi as XElement).Value.Trim().Replace("'", "`");
                        var fiName = (fi as XElement).FirstAttribute.Value;
                        if (fiName == "group")
                        {
                            if (!grpNames.ContainsKey(val))
                            {
                                cmd = string.Format("select r_war from {0} where isware=0 and name='{1}'", sTable, val);
                                using (var reader = BaseRepository.ExecuteReaderEx("BAsket", cmd, null))
                                {
                                    if (reader.Read())
                                    {
                                        grpNames[val] = reader.GetString("r_war").ToString();
                                    }
                                    else
                                    {
                                        cmd =
                                            string.Format(
                                                "Insert {0} (r_war,r_hwar,name,isware) values({1},0,'{2}',0)",
                                                //";Select @@IDENTITY AS fKey",
                                                sTable, iGrpId, val);
                                        var ret = BaseRepository.ExecuteCommand("BAsket", cmd, null);
                                        grpNames[val] = iGrpId.ToString();
                                        iGrpId--;
                                    }
                                }
                            }
                            val = grpNames[val];
                        } 
                        else if (fiName == "stock")
                            val = (val == "True") ? "1" : "0";
                        else if (fiName == "price")
                            val = val.Replace(",", ".");

                        var fiNameOut = fiTran.ContainsKey(fiName) ? fiTran[fiName] : fiName;

                        warFields[fiNameOut] = val;

                        fi = fi.NextNode;
                    } while (fi != null);

                    cmd = string.Format("select * from {0} where r_war='{1}'", sTable, warFields["r_war"]);
                    using (var reader = BaseRepository.ExecuteReaderEx("BAsket", cmd, null))
                    {
                        if (reader.Read())
                        {
                            // try update
                            //grpNames[val] = reader.GetString("r_war").ToString();
                        }
                        else
                        {
                            //insert new
                            cmd =
                                string.Format(
                                    "Insert {0} (r_war,r_hwar,name,name_c,name_manuf,name_pict,ostat,price,isware)" +
                                    " values('{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}', 1)",
                                    sTable, warFields["r_war"], warFields["r_hwar"], warFields["name"],
                                    warFields["name_c"], warFields["name_manuf"], warFields["name_pict"],
                                    warFields["ostat"], warFields["price"]);
                            try
                            {
                                var ret = BaseRepository.ExecuteCommand("BAsket", cmd, null);
                            }
                            catch (Exception ex){}
                        }
                    }
                } 

                dtPriceUpdate = DateTime.Now;
            }
        }

        static public void SaveLog(string sLog)
        {
            var sFN = "C:\\BAsketWS.log";
            if (HttpContext.Current != null && HttpContext.Current.Request != null && HttpContext.Current.Request.PhysicalApplicationPath.Length > 0)
                sFN = HttpContext.Current.Request.PhysicalApplicationPath + "BAsketWS.log";

            DateTime dt = DateTime.Now;
            string sOut = String.Format("\n{0}.{1}.{2} {3}:{4}:{5}| {6}", dt.Day.ToString("D2"), dt.Month.ToString("D2"), (dt.Year - 2000).ToString("D2"), dt.Hour.ToString("D2"), dt.Minute.ToString("D2"), dt.Second.ToString("D2"), sLog);
            System.Diagnostics.Trace.WriteLine(sOut);
            Console.Write(sOut);
            System.Text.Encoding encoding = System.Text.Encoding.Default;
            using (FileStream fs = File.Open(sFN, FileMode.OpenOrCreate, FileAccess.Write, FileShare.Read))
            {
                fs.Seek(0, SeekOrigin.End);
                byte[] info = encoding.GetBytes(sOut.ToCharArray());
                fs.Write(info, 0, info.Length);
            }
        }

        #region creates
        static public void CreateDbObject(string message)
        {
            var sV = message.Split('\'');
            if (sV.Length > 2)
            {
                var cmd = sqlCreateCommands[sV[1]];
                if (!string.IsNullOrEmpty(cmd))
                {
                    BaseRepository.ExecuteCommand("BAsket", cmd, null);
                }
            }
        }

        static Dictionary<string, string> sqlCreateCommands = new Dictionary<string, string>()
        {
            {"spWar1", "Create table dbo.spWar1 (" +
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
                        ";Create Index IX_war_hwar On spWar1(r_hwar)" + 
                        ";Create Index IX_war_name On spWar1(name)" + 
                        ""},
            {"getWarsByGId", "Select * from spWar Where r_hwar={0}"},
            {"getWarById", "Select * from spWar Where r_war={0}"},
        };
        #endregion
    }
}