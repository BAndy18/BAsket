// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ParamsHelper.cs" company="Aramark Corporation">
//   Copyright (c) Aramark Corporation 2011
// </copyright>
// <summary>
//   The params helper.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

#region Namespace Imports

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

#endregion

namespace BAsketWS.DataAccess
{
    /// <summary>
    /// The params helper.
    /// </summary>
    public static class ParamsHelper
    {
        #region Public Methods

        /// <summary>
        /// The add input output parameter.
        /// </summary>
        /// <param name="parameters">
        /// The parameters.
        /// </param>
        /// <param name="parameterName">
        /// The parameter name.
        /// </param>
        /// <param name="parameterType">
        /// The parameter type.
        /// </param>
        /// <param name="parameterValue">
        /// The parameter value.
        /// </param>
        /// <returns>
        /// </returns>
        public static SqlParameter AddInputOutputParameter(
            this List<SqlParameter> parameters, string parameterName, SqlDbType parameterType, object parameterValue)
        {
            SqlParameter parameter = CreateInputOutputParameter(parameterName, parameterType, parameterValue);
            parameters.Add(parameter);
            return parameter;
        }


        /// <summary>
        /// The add input parameter.
        /// </summary>
        /// <param name="parameters">
        /// The parameters.
        /// </param>
        /// <param name="parameterName">
        /// The parameter name.
        /// </param>
        /// <param name="parameterType">
        /// The parameter type.
        /// </param>
        /// <param name="parameterValue">
        /// The parameter value.
        /// </param>
        /// <returns>
        /// </returns>
        public static SqlParameter AddInputParameter(
            this List<SqlParameter> parameters, string parameterName, SqlDbType parameterType, object parameterValue)
        {
            SqlParameter parameter = CreateInputParameter(parameterName, parameterType, parameterValue);
            parameters.Add(parameter);
            return parameter;
        }


        /// <summary>
        /// The add output parameter.
        /// </summary>
        /// <param name="parameters">
        /// The parameters.
        /// </param>
        /// <param name="parameterName">
        /// The parameter name.
        /// </param>
        /// <param name="parameterType">
        /// The parameter type.
        /// </param>
        /// <returns>
        /// </returns>
        public static SqlParameter AddOutputParameter(
            this List<SqlParameter> parameters, string parameterName, SqlDbType parameterType)
        {
            SqlParameter parameter = CreateOutputParameter(parameterName, parameterType);
            parameters.Add(parameter);
            return parameter;
        }


        /// <summary>
        /// The add output parameter.
        /// </summary>
        /// <param name="parameters">
        /// The parameters.
        /// </param>
        /// <param name="parameterName">
        /// The parameter name.
        /// </param>
        /// <param name="parameterType">
        /// The parameter type.
        /// </param>
        /// <param name="size">
        /// The size.
        /// </param>
        /// <returns>
        /// </returns>
        public static SqlParameter AddOutputParameter(
            this List<SqlParameter> parameters, string parameterName, SqlDbType parameterType, int size)
        {
            SqlParameter parameter = CreateOutputParameter(parameterName, parameterType, size);
            parameters.Add(parameter);
            return parameter;
        }


        /// <summary>
        /// The add parameter.
        /// </summary>
        /// <param name="parameters">
        /// The parameters.
        /// </param>
        /// <param name="parameterName">
        /// The parameter name.
        /// </param>
        /// <param name="parameterType">
        /// The parameter type.
        /// </param>
        /// <param name="parameterValue">
        /// The parameter value.
        /// </param>
        /// <param name="parameterDirection">
        /// The parameter direction.
        /// </param>
        /// <returns>
        /// </returns>
        public static SqlParameter AddParameter(
            this List<SqlParameter> parameters, 
            string parameterName, 
            SqlDbType parameterType, 
            object parameterValue, 
            ParameterDirection parameterDirection)
        {
            SqlParameter parameter = CreateParameter(parameterName, parameterType, parameterValue, parameterDirection);
            parameters.Add(parameter);
            return parameter;
        }


        /// <summary>
        /// Create input/output parameter.
        /// </summary>
        /// <param name="parameterName">
        /// Parameter name.
        /// </param>
        /// <param name="parameterType">
        /// Parameter type.
        /// </param>
        /// <param name="parameterValue">
        /// Parameter value.
        /// </param>
        /// <returns>
        /// Parameter. 
        /// </returns>
        public static SqlParameter CreateInputOutputParameter(
            string parameterName, SqlDbType parameterType, object parameterValue)
        {
            return CreateParameter(parameterName, parameterType, parameterValue, ParameterDirection.InputOutput);
        }


        /// <summary>
        /// Create input parameter.
        /// </summary>
        /// <param name="parameterName">
        /// Parameter name.
        /// </param>
        /// <param name="parameterType">
        /// Parameter type.
        /// </param>
        /// <param name="parameterValue">
        /// Parameter value.
        /// </param>
        /// <returns>
        /// Parameter.
        /// </returns>
        public static SqlParameter CreateInputParameter(
            string parameterName, SqlDbType parameterType, object parameterValue)
        {
            return CreateParameter(parameterName, parameterType, parameterValue, ParameterDirection.Input);
        }

        public static SqlParameter CreateInputParameterEx(
            string columnName, SqlDbType parameterType, object parameterValue)
        {
            var parameterName = string.Format("@{0}", columnName);
            return CreateParameter(parameterName, parameterType, parameterValue, ParameterDirection.Input);
        }

        /// <summary>
        /// Create output parameter.
        /// </summary>
        /// <param name="parameterName">
        /// Parameter name.
        /// </param>
        /// <param name="parameterType">
        /// Parameter type.
        /// </param>
        /// <returns>
        /// Parameter.
        /// </returns>
        public static SqlParameter CreateOutputParameter(string parameterName, SqlDbType parameterType)
        {
            return new SqlParameter
                       {
                           ParameterName = parameterName, 
                           SqlDbType = parameterType, 
                           Direction = ParameterDirection.Output, 
                       };
        }


        /// <summary>
        /// Create output parameter with limitation on value size.
        /// </summary>
        /// <param name="parameterName">
        /// Parameter name.
        /// </param>
        /// <param name="parameterType">
        /// Parameter type.
        /// </param>
        /// <param name="size">
        /// Maximal size of parameter value.
        /// </param>
        /// <returns>
        /// Parameter.
        /// </returns>
        public static SqlParameter CreateOutputParameter(string parameterName, SqlDbType parameterType, int size)
        {
            return new SqlParameter
                       {
                           ParameterName = parameterName, 
                           SqlDbType = parameterType, 
                           Size = size, 
                           Direction = ParameterDirection.Output, 
                       };
        }


        /// <summary>
        /// Create parameter.
        /// </summary>
        /// <param name="parameterName">
        /// Parameter name.
        /// </param>
        /// <param name="parameterType">
        /// Parameter type.
        /// </param>
        /// <param name="parameterValue">
        /// Parameter value.
        /// </param>
        /// <param name="parameterDirection">
        /// Parameter direction.
        /// </param>
        /// <returns>
        /// Parameter.
        /// </returns>
        public static SqlParameter CreateParameter(
            string parameterName, SqlDbType parameterType, object parameterValue, ParameterDirection parameterDirection)
        {
            return new SqlParameter
                       {
                           ParameterName = parameterName, 
                           SqlDbType = parameterType, 
                           Direction = parameterDirection, 
                           Value = parameterValue
                       };
        }


        /// <summary>
        /// Extract value from parameters collection.
        /// </summary>
        /// <typeparam name="T">
        /// Parameter type.
        /// </typeparam>
        /// <param name="parameters">
        /// Parameters collection.
        /// </param>
        /// <param name="parameterName">
        /// Parameter Name.
        /// </param>
        /// <returns>
        /// Value.
        /// </returns>
        public static T GetParameterValue<T>(List<SqlParameter> parameters, string parameterName)
        {
            SqlParameter param = parameters.SingleOrDefault(a => a.ParameterName.Equals(parameterName));
            return GetParameterValue<T>(param);
        }


        /// <summary>
        /// The get parameter value.
        /// </summary>
        /// <param name="cmd">
        /// The cmd.
        /// </param>
        /// <param name="parameterName">
        /// The parameter name.
        /// </param>
        /// <typeparam name="T">
        /// </typeparam>
        /// <returns>
        /// </returns>
        public static T GetParameterValue<T>(SqlCommand cmd, string parameterName)
        {
            SqlParameter param = cmd.Parameters[parameterName];
            return GetParameterValue<T>(param);
        }

        #endregion

        #region Methods

        /// <summary>
        /// The get parameter value.
        /// </summary>
        /// <param name="parameter">
        /// The parameter.
        /// </param>
        /// <typeparam name="T">
        /// </typeparam>
        /// <returns>
        /// </returns>
        /// <exception cref="ArgumentNullException">
        /// <c>ArgumentNullException</c>.
        /// </exception>
        private static T GetParameterValue<T>(SqlParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException("parameter");
            }

            if (parameter.Value == DBNull.Value)
            {
                return default(T);
            }

            return (T)parameter.Value;
        }

        #endregion
    }
}