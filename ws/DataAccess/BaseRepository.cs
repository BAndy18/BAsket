// --------------------------------------------------------------------------------------------------------------------
// <copyright file="RepositoryBase.cs" company="Aramark Corporation">
//   Copyright (c) Aramark Corporation 2011
// </copyright>
// <summary>
//   The base repository.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

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
	/// <summary>
	/// The repository base.
	/// </summary>
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

		/// <summary>
		/// The execute command.
		/// </summary>
		/// <param name="connectionName">
		/// The name of a connection to execute a command on.
		/// </param>
		/// <param name="procedureName">
		/// The procedure name.
		/// </param>
		/// <param name="parameters">
		/// The parameters.
		/// </param>
		/// <returns>
		/// The execute command.
		/// </returns>
		public static int ExecuteCommand(string connectionName, string procedureName, List<SqlParameter> parameters)
		{
			var returnValue = 0;

			using (var connection = GetConnection(connectionName))
			using (var command = CreateSqlCommand(connection, procedureName, parameters))
			{
				connection.Open();
				returnValue = command.ExecuteNonQuery();
			}


			return returnValue;
		}

		public static object ExecuteScalar(string connectionName, string procedureName, List<SqlParameter> parameters)
		{
			object returnValue = null;

			using (var connection = GetConnection(connectionName))
			using (var command = CreateSqlCommand(connection, procedureName, parameters))
			{
				connection.Open();
				returnValue = command.ExecuteScalar();

				if (parameters.Count > 0 && parameters[0].Direction == ParameterDirection.Output)
					returnValue = parameters[0].Value;
			}


			return returnValue;
		}

		/// <summary>
		/// The execute reader.
		/// </summary>
		/// <param name="connectionName">
		/// The name of a connection to execute a command on.
		/// </param>
		/// <param name="procedureName">
		/// The procedure name.
		/// </param>
		/// <param name="parameters">
		/// The parameters.
		/// </param>
		/// <returns>
		/// </returns>
		public static SqlDataReader ExecuteReader(string connectionName, string procedureName, List<SqlParameter> parameters)
		{
			SqlDataReader result = null;

			var connection = GetConnection(connectionName);
			using (var command = CreateSqlCommand(connection, procedureName, parameters))
			{
			    try
			    {
			        connection.Open();
			        result = command.ExecuteReader(CommandBehavior.CloseConnection);
			    }
			    catch (Exception ex)
			    {
			        if (ex.Message.StartsWith("Invalid object"))
                        Common.CreateDbObject(ex.Message);
			    }
			}

			return result;
		}

		/// <summary>
		/// The execute DataSet.
		/// </summary>
		/// <param name="connectionName">
		/// The name of a connection to execute a command on.
		/// </param>
		/// <param name="procedureName">
		/// The procedure name.
		/// </param>
		/// <param name="parameters">
		/// The parameters.
		/// </param>
		/// <returns>
		/// </returns>
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

		/// <summary>
		/// The execute reader transactional.
		/// </summary>
		/// <param name="transaction">
		/// The transaction.
		/// </param>
		/// <param name="procedureName">
		/// The procedure name.
		/// </param>
		/// <param name="parameters">
		/// The parameters.
		/// </param>
		/// <returns>
		/// </returns>
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

		/// <summary>
		/// The execute transactional command.
		/// </summary>
		/// <param name="transaction">
		/// The transaction.
		/// </param>
		/// <param name="procedureName">
		/// The procedure name.
		/// </param>
		/// <param name="parameters">
		/// The parameters.
		/// </param>
		/// <returns>
		/// The execute transactional command.
		/// </returns>
		/// <exception cref="Exception">
		/// <c>Exception</c>.
		/// </exception>
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

		/// <summary>
		/// The execute reader ex.
		/// </summary>
		/// <param name="connectionName">
		/// The name of a connection to execute a command on.
		/// </param>
		/// <param name="procedureName">
		/// The procedure name.
		/// </param>
		/// <param name="parameters">
		/// The parameters.
		/// </param>
		/// <returns>
		/// </returns>
		public static DataReaderAdapter ExecuteReaderEx(string connectionName, string procedureName, List<SqlParameter> parameters)
		{
            DataReaderAdapter ra = null;
		    try
		    {
		        ra = new DataReaderAdapter(ExecuteReader(connectionName, procedureName, parameters));
		    }
            catch (Exception ex)
            {
            }
		    return ra;
		}

		#endregion

		#region Methods

		/// <summary>
		/// Get the connection for database.
		/// </summary>
		/// <param name="connectionName">
		/// The name of a connection to execute a command on.
		/// </param>
		/// <returns>
		/// Connection.
		/// </returns>
		private static SqlConnection GetConnection(string connectionName)
		{
			var connectionString = ConfigurationManager.ConnectionStrings[connectionName].ToString();
			var result = new SqlConnection(connectionString);
			return result;
		}

		/// <summary>
		/// Create sql command.
		/// </summary>
		/// <param name="connection">
		/// The connection.
		/// </param>
		/// <param name="procedureName">
		/// Name of stored procedure.
		/// </param>
		/// <param name="parameters">
		/// List of parameters.
		/// </param>
		/// <returns>
		/// SQL command.
		/// </returns>
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

		/// <summary>
		/// The provide method log info.
		/// </summary>
		/// <param name="procedureName">
		/// The procedure name.
		/// </param>
		/// <param name="sqlparameters">
		/// The sqlparameters.
		/// </param>
		/// <returns>
		/// The provide method log info.
		/// </returns>
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
