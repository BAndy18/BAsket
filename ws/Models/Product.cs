using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAsketWS.Models
{
    public class Product
    {
        public string Id { get; set; }
        public string IdP { get; set; }
        public string N { get; set; }
        public string N1 { get; set; }
        public string N2 { get; set; }
        public string N3 { get; set; }
        public string N4 { get; set; }
        public string O { get; set; }
        public decimal P { get; set; }
    }

	public class ProdStock
	{
		public string Id { get; set; }
		public string O { get; set; }
	}

}