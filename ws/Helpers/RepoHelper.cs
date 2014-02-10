using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using BAsketWS.DataAccess;

namespace BAsketWS.Helpers
{
	public class RepoHelper
	{
		static string _sErr;
		static SqlConnection _con = BaseRepository.GetConnection("BAsket");	//new SqlConnection(connectionString);
		static SqlDataAdapter _da = new SqlDataAdapter("", _con);

		static public string RepoPrint(string iID, string email, int iDirect = 0)
		{
			string sRet = "";
			//System.Web.Security.MembershipUser mu = System.Web.Security.Membership.GetUser(false);
			string sFNr = System.IO.Path.GetTempFileName() + ".rpt";
			DataRow dr = GetRows("Select * from sy_PRN Where fkey=" + iID)[0];
			using (var fs = System.IO.File.Open(sFNr, System.IO.FileMode.Create, System.IO.FileAccess.Write, System.IO.FileShare.Read))
			{
				if (!(dr["repfile"] is DBNull))
				{
					Byte[] info = (Byte[])dr["repfile"];
					if (info.Length > 0)
						fs.Write(info, 0, info.Length);
					fs.Close();
				}
			}
			string sFN = "", sNameR = dr["Name"].ToString().Trim();
			DataSet ds = GetDS(dr["SQLExp"].ToString());
			ds.Tables[0].TableName = "DBMM";

			var m_reportDocument = new CrystalDecisions.CrystalReports.Engine.ReportDocument();
			m_reportDocument.FileName = sFNr;
			m_reportDocument.SetDataSource(ds);

			if (iDirect == 0)	//Mail
			{
				sFN = System.IO.Path.GetTempFileName() + ".pdf";
				m_reportDocument.ExportToDisk(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat, sFN);
				//*
				//SendMail(mu.Email, "BAsket report <" + sNameR + ">",
				SendMail(email, "BAsket report <" + sNameR + ">",
					"See the attached file", sFN);
				/*/
				System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage("BAsket@gmail.com",
//				   "bandys18@gmail.com",
					mu.Email,
				   "BAsket report <" + sNameR + ">",
				   "See the attached file");
				System.Net.Mail.Attachment data = new System.Net.Mail.Attachment(sFN);
				message.Attachments.Add(data);
#if IT_cont
				System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient("192.168.200.1");
#else
				System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient("10.0.0.2");
#endif
				client.Send(message);

				message.Dispose();
				client.Dispose();
				/**/
			}
			else if (iDirect == 1)
			{
				sFN = System.IO.Path.GetTempFileName() + ".htm";
				m_reportDocument.ExportToDisk(CrystalDecisions.Shared.ExportFormatType.HTML40, sFN);
				//				sFN = System.IO.Path.GetTempFileName() + ".pdf";
				//				m_reportDocument.ExportToDisk(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat, sFN);
				//				using (System.IO.Stream fs = m_reportDocument.ExportToStream(CrystalDecisions.Shared.ExportFormatType.HTML40))
				using (System.IO.FileStream fs = System.IO.File.Open(sFN, System.IO.FileMode.Open, System.IO.FileAccess.Read, System.IO.FileShare.Read))
				{
					Byte[] info = new Byte[fs.Length];
					fs.Read(info, 0, (int)fs.Length);
					sRet = System.Text.UTF8Encoding.UTF8.GetString(info, 0, (int)fs.Length);
					//					sRet = System.Text.ASCIIEncoding.ASCII.GetString(info, 0, (int)fs.Length);
				}
			}
			m_reportDocument.Dispose();
			///			System.IO.File.Delete(sFNr);
			///			System.IO.File.Delete(sFN);
			//			System.IO.Directory.Delete(sTmpPath, true);
			return sRet;
		}

		static public void SendMail(string sTo, string sSubj, string sBody, string sAttFN)
		{
			System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage("BAsket2@gmail.com",
				//			   "bandys18@gmail.com",
				sTo, sSubj, sBody);
			if (sAttFN.Length > 0)
			{
				System.Net.Mail.Attachment data = new System.Net.Mail.Attachment(sAttFN);
				message.Attachments.Add(data);
			}
			/*
			#if IT_cont
						System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient("192.168.200.1");
			#else
						message.From = new System.Net.Mail.MailAddress("Robot.izhpp@mail.ru");
						System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient("10.0.0.30");
			#endif
						client.Send(message);
			/*/
			System.Net.Mail.SmtpClient client;
			ConnectionStringSettings css = ConfigurationManager.ConnectionStrings["SMTPserver"];
			if (css != null)
			{
				string[] sv = css.ConnectionString.Split(';');
				client = new System.Net.Mail.SmtpClient(sv[0]);
				if (sv.Length > 1 && sv[1].Length > 6 && sv[1].Contains('@') && sv[1].Contains('.'))
					message.From = new System.Net.Mail.MailAddress(sv[1]);
			}
			else
			{
				//*
				client = new System.Net.Mail.SmtpClient()
				{
					Host = "smtp.collaborationhost.net",
					Port = 587,
					DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network,
					UseDefaultCredentials = true,
					Credentials = new System.Net.NetworkCredential("BAsket18.O3@gmail.com", "BAsket18")
				};
				/*/
								client = new System.Net.Mail.SmtpClient("smtp.gmail.com", 587);
								client.UseDefaultCredentials = false;
								client.Credentials = new System.Net.NetworkCredential("BAsket18.O3@gmail.com", "BAsket18");
								client.EnableSsl = true;
				/**/
			}
			client.Send(message);
			/**/
			message.Dispose();
			client.Dispose();
		}

		static public DataRowCollection GetRows(string sSQL)
		{
			DataSet ds = GetDS(sSQL);
			if (ds.Tables.Count > 0)
				return ds.Tables[0].Rows;
			return null;
		}
        static public DataSet GetDS(string sSQL) { return GetDS(sSQL, null); }
		static public DataSet GetDS(string sSQL, SqlCommand com)
		{
            _sErr = "";
            if (_con == null) return null;
			if (sSQL.ToLower().IndexOf("{call") == 0 || sSQL.IndexOf("#") > 0)
			{
				sSQL = sSQL.ToLower().Replace("{call", "exec").Replace("}", "").Replace("(", " ").Replace(")", "")
					.Replace("#опер#", "0")
					.Replace("#дата#", "''")
					.Replace("#период_начало#", "'" + DateTime.Now.AddDays(-14).ToString("yyyMMdd") + "'")
					.Replace("#период_конец#", "'" + DateTime.Now.ToString("yyyMMdd") + "'")
					.Replace("#прайс_лист#", "'','',1,0,0,0,0,0,0.000000,0");
				
				if (sSQL.Contains("#тип_торгпред#"))
				{
					//WebUserDetails wud = Ini_WebUsers();
					//if (wud != null)
					//	sSQL = sSQL.Replace("#тип_торгпред#", "'N_TP=" + wud._iTP.ToString() + "'");
					var user = HttpContext.Current.User.Identity.Name;
					if (user.Split(';').Length < 2)
					{
						user = ";-1";
						//return new List<Bil> { new Bil() { cName = "user not found " + user } };
					}

					sSQL = sSQL.Replace("#тип_торгпред#", "'N_TP=" + user.Split(';')[1] + "'");
				}
			}
            if (com == null)
                _da.SelectCommand = new SqlCommand(sSQL, _con);
            else
                _da.SelectCommand = com;
			DataSet ds = new DataSet();
            try
            {
                if (_con.State != ConnectionState.Open)
                    _con.Open();
                _da.Fill(ds);
            }
            catch (Exception ex)
            {
                _sErr = ex.Message;
				Common.SaveLog(ex.Message);
                return null;
            }
			return ds;
		} 
	}
}