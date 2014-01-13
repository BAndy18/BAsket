using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BAsketWS.Models
{
    public class Client
    {
        public string Id { get; set; }
        public string IdPar { get; set; }
        public string Name { get; set; }
        public string FullName { get; set; }
        public string Adres { get; set; }
        public string GeoLoc { get; set; }
    }
}