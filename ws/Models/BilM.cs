using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAsketWS.Models
{
    public class BilM
    {
        public string Id { get; set; }
        public string IdC { get; set; }
        public string IdT { get; set; }
		public string IdUser { get; set; }
		public string LocNum { get; set; }

		public string NumDoc { get; set; }
        public string DateDoc { get; set; }
        //public string ShortDate { get; set; }
        public string SumDoc { get; set; }
        public string Note { get; set; }
        public string Wars { get; set; }

		public string N1 { get; set; }
		public string N2 { get; set; }
		public string N3 { get; set; }
		public string N4 { get; set; }

		//public string sOther { get; set; }
		//public string cName { get; set; }
		//public string tName { get; set; }
		//public string FullName { get; set; }
		//public string AdresDost { get; set; }
    }
}