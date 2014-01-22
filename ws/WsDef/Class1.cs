using System;
using System.ComponentModel.Composition;
using BAsketWS.Controllers;

namespace WsDef
{
	[ExportMetadata("ViewType", "MyTest1")]
	[Export(typeof(IMyTest))]
	public class MyTest1 : IMyTest
	{
		public MyTest1()
		{
			creationDate = DateTime.Now;
		}

		public string GetMessage()
		{
			return String.Format("MyTest1 created at {0}", creationDate.ToString("hh:mm:ss"));
		}

		private DateTime creationDate;
	}
}
