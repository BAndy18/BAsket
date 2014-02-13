
#region Namespace Imports

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Text;

//using log4net;

#endregion

namespace BAsketWS.DataAccess
{
	public abstract class BaseRepository
	{
		#region Constants and Fields

		/// <summary>
		/// The _log.
		/// </summary>
		//private static readonly ILog _log = LogManager.GetLogger(typeof(BaseRepository));

		/// <summary>
		/// Parameters which are excluded from the entries in the log.
		/// </summary>
		private const string LogExcludeParameters = "password";

		#endregion

		#region Public Methods

		public static List<SqlParameter> NewParamList(SqlParameter prm)
		{
			return new List<SqlParameter>() { prm };
		}
		public static SqlParameter NewParam(string pName, string pValue, ParameterDirection pDirect, int pSize)
		{
			return new SqlParameter(pName, pValue) {Direction = pDirect, Size = pSize};
		}

		public static int ExecuteCommand(string procedureName)
		{
			return ExecuteCommand("BAsket", procedureName, null);
		}
		public static int ExecuteCommand(string connectionName, string procedureName, List<SqlParameter> parameters)
		{
			var returnValue = 0;

			var sDebug = ConfigurationManager.AppSettings["Debug"];
			//if (!string.IsNullOrEmpty(sDebug) && sDebug.ToLower() == "true")
				//Common.SaveLog("ExecuteCommand: sql=" + procedureName);

			using (var connection = GetConnection(connectionName))
			using (var command = CreateSqlCommand(connection, procedureName, parameters))
			{
				connection.Open();
				returnValue = command.ExecuteNonQuery();
			}


			return returnValue;
		}

		public static object ExecuteScalar(string procedureName)
		{
			return ExecuteScalar("BAsket", procedureName, null);
		}
		public static object ExecuteScalar(string procedureName, List<SqlParameter> parameters)
		{
			return ExecuteScalar("BAsket", procedureName, parameters);
		}
		public static object ExecuteScalar(string connectionName, string procedureName, List<SqlParameter> parameters)
		{
			object returnValue = null;

			var sDebug = ConfigurationManager.AppSettings["Debug"];
			//if (!string.IsNullOrEmpty(sDebug) && sDebug.ToLower() == "true")
				Common.SaveLog("ExecuteScalar: sql=" + procedureName);
			
			using (var connection = GetConnection(connectionName))
			using (var command = CreateSqlCommand(connection, procedureName, parameters))
			{
				connection.Open();
				returnValue = command.ExecuteScalar();

				if (parameters != null && parameters.Count > 0 && parameters[0].Direction == ParameterDirection.Output)
					returnValue = parameters[0].Value;
			}


			return returnValue;
		}

		public static SqlDataReader ExecuteReader(string connectionName, string procedureName, List<SqlParameter> parameters)
		{
			SqlDataReader result = null;

			var sDebug = ConfigurationManager.AppSettings["Debug"];
			if (!string.IsNullOrEmpty(sDebug) && sDebug.ToLower() == "true")
				Common.SaveLog("ExecuteReader: sql=" + procedureName);
			
			var connection = GetConnection(connectionName);
			using (var command = CreateSqlCommand(connection, procedureName, parameters))
			{
			    try
			    {
			        connection.Open();
			        result = command.ExecuteReader(CommandBehavior.CloseConnection);
			    }
			    catch (SqlException ex)
			    {
					//if (ex is SqlException && (ex as SqlException).Number == 15350)
						//Common.CreateDb(connectionName);
			        if (ex.Number == 208)	// Invalid object
                        Common.CreateDbObject(ex.Message);
			        else
						Common.SaveLog("ExecuteReader: " + ex.Message);
			    }
			}

			return result;
		}

		public static DataReaderAdapter ExecuteReaderEx(string procedureName)
		{
			return ExecuteReaderEx("BAsket", procedureName, null);
		}
		public static DataReaderAdapter ExecuteReaderEx(string procedureName, List<SqlParameter> parameters)
		{
			return ExecuteReaderEx("BAsket", procedureName, parameters);
		}
		public static DataReaderAdapter ExecuteReaderEx(string connectionName, string procedureName, List<SqlParameter> parameters)
		{
			DataReaderAdapter ra = null;
			try
			{
				ra = new DataReaderAdapter(ExecuteReader(connectionName, procedureName, parameters));
			}
			catch (Exception ex)
			{
				if (!(ex is ArgumentNullException))
					Common.SaveLog("ExecuteReaderEx: " + ex.Message);
			}
			return ra;
		}

		public static DataSet ExecuteDataSet(string connectionName, string procedureName, List<SqlParameter> parameters)
		{
			var result = new DataSet();

			using (var connection = GetConnection(connectionName))
			using (var command = CreateSqlCommand(connection, procedureName, parameters))
			using (var adapter = new SqlDataAdapter(command))
			{
				connection.Open();
				adapter.Fill(result);
			}

			return result;
		}

		public static SqlDataReader ExecuteReaderTransactional(SqlTransaction transaction, string procedureName, List<SqlParameter> parameters)
		{
			SqlDataReader result = null;

			using (var command = CreateSqlCommand(transaction.Connection, procedureName, parameters))
			{
				command.Transaction = transaction;
				result = command.ExecuteReader();
			}

			return result;
		}

		public static int ExecuteTransactionalCommand(SqlTransaction transaction, string procedureName, List<SqlParameter> parameters)
		{
			var returnValue = 0;

			using (var command = CreateSqlCommand(transaction.Connection, procedureName, parameters))
			{
				command.Transaction = transaction;
				returnValue = command.ExecuteNonQuery();
			}

			return returnValue;
		}

		public static SqlTransaction BeginTransaction()
		{
			return BeginTransaction("BAsket");
		}

		public static SqlTransaction BeginTransaction(string connectionName)
		{
			var connection = GetConnection(connectionName);
			connection.Open();
			var sqlTran = connection.BeginTransaction();

			return sqlTran;
		}

		public static void CommitTransaction(SqlTransaction transaction)
		{
			transaction.Commit();
		}

		#endregion

		#region Methods

		public static SqlConnection GetConnection(string connectionName)
		{
			var connectionString = ConfigurationManager.ConnectionStrings[connectionName].ToString();
			var result = new SqlConnection(connectionString);
			return result;
		}

		private static SqlCommand CreateSqlCommand(SqlConnection connection, string procedureName, List<SqlParameter> parameters)
		{
            //_log.InfoFormat("Execute stored procedure {0}", procedureName);

            //if (_log.IsDebugEnabled)
            //{
            //    _log.DebugFormat("Stored procedure string: {0}", GetStoredProcedureString(procedureName, parameters));
            //}
		    var commandType = (procedureName.ToUpper().StartsWith("SELECT ")) ? CommandType.Text : CommandType.StoredProcedure;
			var cmd = new SqlCommand
						  {
							  CommandText = procedureName,
							  Connection = connection,
                              //CommandType = CommandType.StoredProcedure,
                              CommandType = CommandType.Text,
                              //CommandType = commandType,
							  CommandTimeout = connection.ConnectionTimeout
						  };

			// Apply Parameters(cmd, parameters)
			if (parameters != null)
			{
				foreach (var param in parameters)
				{
					if (param.Direction != ParameterDirection.Output && param.Value == null)
					{
						param.Value = DBNull.Value;
					}

					cmd.Parameters.Add(param);
				}
			}

			return cmd;
		}

		protected static string GetStoredProcedureString(string procedureName, IEnumerable<SqlParameter> sqlparameters)
		{
			var builder = new StringBuilder();
			builder.AppendFormat("exec {0} ", procedureName);
			bool isFirstParameter = true;

			if (sqlparameters != null)
			{
				foreach (var param in sqlparameters)
				{
					var paramValue = param.Value;
					var paramName = param.ParameterName;

					if (!isFirstParameter)
					{
						builder.Append(", ");
					}

					if (!paramName.StartsWith("@"))
						builder.Append("@");

					if ((paramValue != null) && (!(paramValue is System.DBNull)))
					{
						if (param.SqlDbType == SqlDbType.Int)
							paramValue = ((int)param.Value);

						if (param.SqlDbType == SqlDbType.Structured)
						{
							var value = paramName;
							var tableDeclare = GetTableSQLParamForLogging(param, ref value);
							paramValue = value;
							builder.Insert(0, tableDeclare);
						}
						else
						{
							paramValue = string.Format("'{0}'", paramValue);
						}

						if (paramName.ToLower().Contains(LogExcludeParameters.ToLower()))
						{
							paramValue = "***";
						}

						builder.AppendFormat("{0} = {1}", paramName, paramValue);
					}
					else
					{
						builder.AppendFormat("{0} = {1}", paramName, "NULL");
					}

					isFirstParameter = false;
				}
			}

			return builder.ToString();
		}

		protected static string GetTableSQLParamForLogging(SqlParameter param, ref string paramName)
		{
			const string SelectJoins = " union all\n";
			var builder = new StringBuilder();
			try
			{
				var table = param.Value as DataTable;
				builder.AppendFormat("declare {0} <Insert TableType>\n", param.ParameterName);
				
				builder.AppendFormat("insert into {0} (", param.ParameterName);
				foreach (DataColumn col in table.Columns)
				{
					builder.AppendFormat("{0},", col.ColumnName);
				}
				builder.Remove(builder.Length - 1, 1);
				builder.AppendLine(")");
				
				foreach (DataRow row in table.Rows)
				{
					builder.Append("select ");
					foreach (var item in row.ItemArray)
					{
						if (item is System.DBNull)
							builder.AppendFormat("NULL,");
						else
							builder.AppendFormat("'{0}',", item);
					}
					builder.Remove(builder.Length - 1, 1);
					builder.Append(SelectJoins);
				}
				builder.Remove(builder.Length - SelectJoins.Length, SelectJoins.Length);
				builder.Append("\n");
			}
			catch (Exception)
			{
				builder.Clear();
				paramName = "'<Unknown Table Structure>'";
			}
			return builder.ToString();
		}

		#endregion

	}
}
