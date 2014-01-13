using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAsketWS.Models
{
    public class BilM
    {
        public string Id { get; set; }

        public string DateDoc { get; set; }
        public string SumDoc { get; set; }
        public string sNote { get; set; }
        public string sOther { get; set; }
        public string sWars { get; set; }
        
        public string cName { get; set; }
        public string tName { get; set; }
        public string FullName { get; set; }
        public string AdresDost { get; set; }
    }
}