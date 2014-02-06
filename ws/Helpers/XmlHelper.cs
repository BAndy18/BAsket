using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using System.Xml;
using System.Xml.Serialization;
using BAsketWS.DataAccess;
using BAsketWS.Models;

namespace BAsketWS.Helpers
{
	public class XmlHelper
	{
		
		public static string XmlOut(List<Product> inProducts)
		{
			var h = new BAsketSwap.CHeader()
			{
				SwapNumber = "",
				SwapDate = DateTime.Now.ToString()
			};

			var l = new BAsketSwap.CProds() { };
			foreach (var pr in inProducts)
			{
				var li = new BAsketSwap.ProdItem()
				{
					Id = pr.Id,
					IdP = pr.IdP,
					Name = pr.N,
					Stock = pr.O,
					Price = pr.P.ToString()
				};

				l.FProd.Add(li);
//				l.FProd.Add(new BAsketSwap.Prod() { ProdItem = li });
			}
			var da = new BAsketSwap() { Header = h, Products = l };
			return xmlout(da);
		}
		public static string XmlOut(List<Category> inProducts)
		{
			var h = new BAsketSwap.CHeader()
			{
				SwapNumber = "",
				SwapDate = DateTime.Now.ToString()
			};

			var l = new BAsketSwap.CProds() { };
			foreach (var pr in inProducts)
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
			return xmlout(da);
		}

		public void xmlin()
		{
			BAsketSwap doc;
			var ser = XmlSerializer.FromTypes(new[] { typeof(BAsketSwap) })[0];
			using (var reader = XmlReader.Create(Common.StockFileName))
			{
				doc = (BAsketSwap)ser.Deserialize(reader);
			}
			if (doc == null)
				return;

			
//			foreach (var line in doc.Products.FProd)
//			{
//				sQ = string.Format(@"Insert BilS (r_bil, quant, r_war, price, NDS, N_UNI) 
//					Select {0} as r_bil, {1} as quant, w.r_war, ISNULL(wc.PriceR*(1 + cast(w.NDS as real)/100), 0), w.NDS, w.N_UNI From spWar w 
//						Join spWarCli wc On (w.r_war=wc.r_war and wc.r_cli={2}) 
//					Where wc.r_warcli={3}",
//				lKey, line.LineItem.OrderedQuantity, CliId, line.LineItem.BuyerItemCode);
//				db.ExecScalar(sQ);
//			}
//			sQ = string.Format(@"exec BilRenumber {0}; exec BilCalcSum {0}; Update Bil set Discont=150 Where r_bil={0}", lKey);
//			db.ExecScalar(sQ);
		}

		public static string xmlout(BAsketSwap da)
		{
			var sOut = "";
			if (da == null)
				return "";
			if (string.IsNullOrEmpty(Common.StockFileName))
				return "";

			try
			{
				var ser = new System.Xml.Serialization.XmlSerializer(typeof(BAsketSwap));
				using (var writer = new StreamWriter(Common.StockFileName))
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

		public class BAsketSwap
		{
			[XmlElementAttribute("BAsketSwap-Header")]
			public CHeader Header { get; set; }

			[XmlElementAttribute("BAsketSwap-Products")]
			public CProds Products { get; set; }

			//[XmlElementAttribute("BAsketSwap-Clients")]
			//public CSumms Summs { get; set; }

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
		}

	}
}