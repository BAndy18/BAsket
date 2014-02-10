using System;
using System.Collections.Generic;
using System.IO;
using System.Xml;
using System.Xml.Serialization;
using BAsketWS.DataAccess;
using BAsketWS.Models;

namespace BAsketWS.Helpers
{
	public class XmlHelper
	{
		#region test XmlOut
		public static string XmlOut(List<Category> inS)
		{
			var h = new BAsketSwap.CHeader()
			{
				SwapNumber = "",
				SwapDate = DateTime.Now.ToString()
			};

			var l = new BAsketSwap.CProds() { };
			foreach (var pr in inS)
			{
				var li = new BAsketSwap.ProdItem()
				{
					Id = pr.Id,
					Name = pr.N,
				};

				l.FProd.Add(li);
				//				l.FProd.Add(new BAsketSwap.Prod() { ProdItem = li });
			}
			var da = new BAsketSwap() { Header = h, Products = l };
			return XmlOutToFile(da, typeof(BAsketSwap));
		}
		public static string XmlOut(List<Product> inS)
		{
			var h = new BAsketSwap.CHeader()
			{
				SwapNumber = "",
				SwapDate = DateTime.Now.ToString()
			};

			var l = new BAsketSwap.CProds() { };
			foreach (var pr in inS)
			{
				var li = new BAsketSwap.ProdItem()
				{
					Id = pr.Id,
					IdP = pr.IdP,
					Name = pr.N,
					Name1 = pr.N1,
					Name2 = pr.N2,
					Name3 = pr.N3,
					Name4 = pr.N4,
					Stock = pr.O,
					Price = pr.P.ToString()
				};

				l.FProd.Add(li);
			}
			var da = new BAsketSwap() { Header = h, Products = l };
			return XmlOutToFile(da, typeof(BAsketSwap));
		}
		public static string XmlOut(List<Client> inS)
		{
			var h = new BAsketSwap.CHeader()
			{
				SwapNumber = "",
				SwapDate = DateTime.Now.ToString()
			};

			var l = new BAsketSwap.CClients() { };
			foreach (var pr in inS)
			{
				var li = new BAsketSwap.CliItem()
				{
					Id = pr.Id,
					IdP = pr.IdP,
					Name = pr.N,
					Name1 = pr.N1,
					Adres = pr.A,
				};

				l.FCli.Add(li);
			}
			var da = new BAsketSwap() { Header = h, Clients = l };
			return XmlOutToFile(da, typeof(BAsketSwap));
		}
		/**/
		public static string XmlOut(BAsketBil b)
		{
			var i = 1;
			var sFn = string.Format("{0}Bil-{1}.{2}-{3}", Common.GetRootDir() + Common.DirMessagesOut,
				DateTime.Now.ToString("yyMMdd"), b.Header.UserName.Replace(";", "_"), i);
			while (File.Exists(sFn + i + ".xml")) i++;

			return XmlOutToFile(b, typeof(BAsketBil), sFn + ".xml");
		}
		
		#endregion

		static string XmlOutToFile(object da, Type outType, string sFn = "")
		{

			var sOut = "";
			if (da == null)
				return "";
			if (string.IsNullOrEmpty(sFn))
			{
				sFn = Common.StockFileName;
				if (string.IsNullOrEmpty(sFn))
					return "";
			}
			try
			{
				var ser = new System.Xml.Serialization.XmlSerializer(outType);
				using (var writer = new StreamWriter(sFn))
				//using (var writer = new StringWriter())
				{
					var setts = new XmlWriterSettings() {Indent = true};
					using (var wtr = XmlWriter.Create(writer, setts))
					{
						ser.Serialize(wtr, da);
					}
					sOut = writer.ToString();
					writer.Close();
				}
			}
			catch (Exception e)
			{
				Common.SaveLog("XmlHelper: " + e.Message);
			}
			return sOut;
		}
		void Xmlin()
		{
			BAsketSwap doc;
			var ser = XmlSerializer.FromTypes(new[] { typeof(BAsketSwap) })[0];
			using (var reader = XmlReader.Create(Common.StockFileName))
			{
				doc = (BAsketSwap)ser.Deserialize(reader);
			}
			if (doc == null)
				return;
		}

		public class BAsketSwap
		{
			[XmlElementAttribute("BAsketSwap-Header")]
			public CHeader Header { get; set; }

			[XmlElementAttribute("BAsketSwap-Products")]
			public CProds Products { get; set; }

			[XmlElementAttribute("BAsketSwap-Clients")]
			public CClients Clients { get; set; }

			public class CHeader
			{
				public string SwapNumber { get; set; }
				public string SwapDate { get; set; }
			}

			public class CProds
			{
				[XmlElement("Prod")]
				public List<ProdItem> FProd = new List<ProdItem>();
			}
			public class Prod
			{
				[XmlElement("Prod-Item")]
				public ProdItem ProdItem { get; set; }
			}
			public class ProdItem
			{
				[XmlAttribute]
				public string Id { get; set; }
				[XmlAttribute]
				public string IdP { get; set; }
				[XmlAttribute]
				public string Name { get; set; }
				[XmlAttribute]
				public string Name1 { get; set; }
				[XmlAttribute]
				public string Name2 { get; set; }
				[XmlAttribute]
				public string Name3 { get; set; }
				[XmlAttribute]
				public string Name4 { get; set; }
				[XmlAttribute]
				public string Stock { get; set; }
				[XmlAttribute]
				public string Price { get; set; }
			}

			public class CClients
			{
				[XmlElement("Client")]
				public List<CliItem> FCli = new List<CliItem>();
			}
			public class CliItem
			{
				[XmlAttribute]
				public string Id { get; set; }
				[XmlAttribute]
				public string IdP { get; set; }
				[XmlAttribute]
				public string Name { get; set; }
				[XmlAttribute]
				public string Name1 { get; set; }
				[XmlAttribute]
				public string Name2 { get; set; }
				[XmlAttribute]
				public string Adres { get; set; }
			}

		}

		public class BAsketBil
		{
			[XmlElementAttribute("BAsketBil-Header")]
			public CHeader Header { get; set; }

			[XmlElementAttribute("BAsketSwap-Products")]
			public CProds Products { get; set; }

			public class CHeader
			{
				public string UserName { get; set; }
				public string IdLoc { get; set; }
				public string Number { get; set; }
				public string Date { get; set; }
				public string IdC { get; set; }
				public string IdT { get; set; }
				public string Note { get; set; }
				public string SumDoc { get; set; }
				public string Other { get; set; }
				public string Wars { get; set; }
				public string Result { get; set; }
			}
			public class CProds
			{
				[XmlElement("Prod")]
				public List<ProdItem> FProd = new List<ProdItem>();
			}
			public class ProdItem
			{
				[XmlAttribute]
				public string ProdId { get; set; }
				[XmlAttribute]
				public string Quant { get; set; }
			}
		}
	}
}