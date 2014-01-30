using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Linq;
using System.Xml.Linq;

namespace BAsketWS.DataAccess
{
	public class DbfHelper
	{
		static DateTime dtPriceUpdate = DateTime.Now;
		static string sPricePath = "d:\\price.dbf";
		public const string SWarTable = "bas_spWar";

		static public void readDbf()
		{
			var iGrpId = GetLastGrpId();

			var grpNames = new Dictionary<string, string>();
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

			var isFirst = true;
			foreach (DataRow dr in dbfTable.Rows)
			{
				if (isFirst)
				{
					isFirst = false;
					continue;
				}
				var group = dr["group"].ToString();
				if (!grpNames.ContainsKey(group))
				{
					var s = GetDbValue<string>(string.Format("select r_war from {0} where isware=0 and name='{1}'", SWarTable, group));
					if (string.IsNullOrEmpty(s))
					{
						cmd = string.Format("Insert {0} (r_war,r_hwar,name,isware) values({1},0,'{2}',0)",
								SWarTable, iGrpId, group);
						var ret = BaseRepository.ExecuteCommand("BAsket", cmd, null);
						grpNames[group] = iGrpId.ToString();
						iGrpId--;
					}
					else
						grpNames[group] = s;
				}
				group = grpNames[group];

				cmd = string.Format("select * from {0} where r_war='{1}'", SWarTable, dr["code"]);
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
								SWarTable, dr["code"], group, dr["name"],
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

		static T GetDbValue<T>(string query, string table = "")
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
						Common.CreateDbObject(ex.Message, table);
				}
			}
			return ret;
		}

		static int GetLastGrpId()
		{
			var iGrpId = GetDbValue<int>(string.Format("select min(cast(r_war as int)) as r_war from {0} where isware=0 and left(r_war,1)<>'.'", SWarTable));
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
			Common.SaveLog("CheckPriceStatus");
			//if (File.Exists(sPricePath) && File.GetLastWriteTime(sPricePath) > dtPriceUpdate)
			{
				var iGrpId = GetLastGrpId();

				var grpNames = new Dictionary<string, string>();
				var fiTran = new Dictionary<string, string>() { { "code", "r_war" }, { "art", "name_c" }, { "group", "r_hwar" }, { "manufact", "name_manuf" }, { "pict", "name_pict" }, { "stock", "ostat" } };
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
								cmd = string.Format("select r_war from {0} where isware=0 and name='{1}'", SWarTable, val);
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
												SWarTable, iGrpId, val);
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

					cmd = string.Format("select * from {0} where r_war='{1}'", SWarTable, warFields["r_war"]);
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
									SWarTable, warFields["r_war"], warFields["r_hwar"], warFields["name"],
									warFields["name_c"], warFields["name_manuf"], warFields["name_pict"],
									warFields["ostat"], warFields["price"]);
							try
							{
								var ret = BaseRepository.ExecuteCommand("BAsket", cmd, null);
							}
							catch (Exception ex) { }
						}
					}
				}

				dtPriceUpdate = DateTime.Now;
			}
		}
	}
}