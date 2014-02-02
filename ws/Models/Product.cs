using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAsketWS.Models
{
    public class Product
    {
        public string Id { get; set; }
        public string GrId { get; set; }
        public string Name { get; set; }
        public string NameArt { get; set; }
        public string NameManuf { get; set; }
        public string UrlPict { get; set; }
        public string Upak { get; set; }
        public string O { get; set; }
        public decimal Price { get; set; }
    }

	public class ProdOst
	{
		public string Id { get; set; }
		public string O { get; set; }
	}

}