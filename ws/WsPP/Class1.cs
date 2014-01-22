using System;
using System.ComponentModel.Composition;
using BAsketWS.Models;

namespace WsPP
{
	[ExportMetadata("ViewType", "MyTest2")]
	[Export(typeof(IMyTest))]
	public class MyTest2 : IMyTest
	{
		public MyTest2()
		{
			creationDate = DateTime.Now;
		}

		public string GetMessage()
		{
			return String.Format("MyTest2 created at {0}", creationDate.ToString("hh:mm:ss"));
		}

		private DateTime creationDate;
	}
}
