// --------------------------------------------------------------------------------------------------------------------
// <copyright file="DataReaderAdapter.cs" company="Aramark Corporation">
//   Copyright (c) Aramark Corporation 2011
// </copyright>
// <summary>
//   The data reader adapter.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

#region Namespace Imports

using System;
using System.Collections.Generic;
using System.Data.SqlClient;

#endregion

namespace BAsketWS.DataAccess
{
    /// <summary>
    /// The data reader adapter.
    /// </summary>
    public sealed class DataReaderAdapter : IDisposable
    {
        #region Constants and Fields

        /// <summary>
        /// The _data reader.
        /// </summary>
        private readonly SqlDataReader _dataReader;

        /// <summary>
        /// The _row schema.
        /// </summary>
        private readonly Dictionary<string, int> _rowSchema;

        #endregion

        #region Constructors and Destructors

        /// <summary>
        /// Initializes a new instance of the <see cref="DataReaderAdapter"/> class.
        /// </summary>
        /// <param name="dataReader">
        /// The data reader.
        /// </param>
        /// <exception cref="ArgumentNullException">
        /// <c>ArgumentNullException</c>.
        /// </exception>
        public DataReaderAdapter(SqlDataReader dataReader)
        {
            if (dataReader == null)
            {
                throw new ArgumentNullException("dataReader");
            }

            _dataReader = dataReader;
            _rowSchema = new Dictionary<string, int>(StringComparer.InvariantCultureIgnoreCase);
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// The dispose.
        /// </summary>
        public void Dispose()
        {
            if (_dataReader != null)
                _dataReader.Dispose();
        }


        /// <summary>
        /// The get boolean.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// The get boolean.
        /// </returns>
        public bool GetBoolean(string field)
        {
            return GetBoolean(field, default(bool));
        }


        /// <summary>
        /// The get boolean.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <returns>
        /// The get boolean.
        /// </returns>
        public bool GetBoolean(string field, bool defaultValue)
        {
            int index = GetOrdinal(field);
            return _dataReader.IsDBNull(index) ? defaultValue : _dataReader.GetBoolean(index);
        }


        /// <summary>
        /// The get nullable boolean.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <returns>
        /// The get nullable boolean.
        /// </returns>
        public bool? GetBooleanNull(string field)
        {
            return GetValue<bool?>(field, null);
        }


        /// <summary>
        /// The get byte.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// The get byte.
        /// </returns>
        public byte GetByte(string field)
        {
            return GetByte(field, default(byte));
        }


        /// <summary>
        /// The get byte.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <returns>
        /// The get byte.
        /// </returns>
        public byte GetByte(string field, byte defaultValue)
        {
            int index = GetOrdinal(field);
            return _dataReader.IsDBNull(index) ? defaultValue : _dataReader.GetByte(index);
        }


        /// <summary>
        /// The get bytes.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="fieldOffset">
        /// The field offset.
        /// </param>
        /// <param name="buffer">
        /// The buffer.
        /// </param>
        /// <param name="bufferOffset">
        /// The buffer offset.
        /// </param>
        /// <param name="length">
        /// The length.
        /// </param>
        /// <returns>
        /// The get bytes.
        /// </returns>
        public long GetBytes(string field, long fieldOffset, byte[] buffer, int bufferOffset, int length)
        {
            return _dataReader.GetBytes(GetOrdinal(field), fieldOffset, buffer, bufferOffset, length);
        }


        /// <summary>
        /// The get char.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// The get char.
        /// </returns>
        public char GetChar(string field)
        {
            return GetChar(field, default(char));
        }


        /// <summary>
        /// The get char.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <returns>
        /// The get char.
        /// </returns>
        public char GetChar(string field, char defaultValue)
        {
            int index = GetOrdinal(field);
            return _dataReader.IsDBNull(index) ? defaultValue : _dataReader.GetChar(index);
        }


        /// <summary>
        /// The get chars.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="fieldOffset">
        /// The field offset.
        /// </param>
        /// <param name="buffer">
        /// The buffer.
        /// </param>
        /// <param name="bufferOffset">
        /// The buffer offset.
        /// </param>
        /// <param name="length">
        /// The length.
        /// </param>
        /// <returns>
        /// The get chars.
        /// </returns>
        public long GetChars(string field, long fieldOffset, char[] buffer, int bufferOffset, int length)
        {
            return _dataReader.GetChars(GetOrdinal(field), fieldOffset, buffer, bufferOffset, length);
        }


        /// <summary>
        /// The get date time.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// </returns>
        public DateTime GetDateTime(string field)
        {
            return GetDateTime(field, default(DateTime));
        }


        /// <summary>
        /// The get date time.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <returns>
        /// </returns>
        public DateTime GetDateTime(string field, DateTime defaultValue)
        {
            int index = GetOrdinal(field);

            if (_dataReader.IsDBNull(index))
            {
                return defaultValue;
            }
            else
            {
                DateTime dateTime = _dataReader.GetDateTime(index);
                return DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
            }
        }


        /// <summary>
        /// The get date time null.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// </returns>
        public DateTime? GetDateTimeNull(string field)
        {
            return GetDateTimeNull(field, null);
        }


        /// <summary>
        /// The get date time null.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <returns>
        /// </returns>
        public DateTime? GetDateTimeNull(string field, DateTime? defaultValue)
        {
            int index = GetOrdinal(field);

            if (_dataReader.IsDBNull(index))
            {
                return defaultValue;
            }
            else
            {
                var dateTime = (DateTime?)_dataReader.GetValue(index);
                return dateTime.HasValue ? (DateTime?)DateTime.SpecifyKind(dateTime.Value, DateTimeKind.Utc) : null;
            }
        }


        /// <summary>
        /// The get date time offset.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// </returns>
        public DateTimeOffset GetDateTimeOffset(string field)
        {
            return GetDateTimeOffset(field, default(DateTimeOffset));
        }


        /// <summary>
        /// The get date time offset.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <returns>
        /// </returns>
        public DateTimeOffset GetDateTimeOffset(string field, DateTimeOffset defaultValue)
        {
            int index = GetOrdinal(field);
            return _dataReader.IsDBNull(index) ? defaultValue : _dataReader.GetDateTimeOffset(index);
        }


        /// <summary>
        /// The get decimal.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// The get decimal.
        /// </returns>
        public decimal GetDecimal(string field)
        {
            return GetDecimal(field, default(decimal));
        }


        /// <summary>
        /// The get decimal.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <returns>
        /// The get decimal.
        /// </returns>
        public decimal GetDecimal(string field, decimal defaultValue)
        {
            int index = GetOrdinal(field);
            return _dataReader.IsDBNull(index) ? defaultValue : _dataReader.GetDecimal(index);
        }


        /// <summary>
        /// The get decimal null.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// </returns>
        public decimal? GetDecimalNull(string field)
        {
            return GetValue<decimal?>(field, null);
        }


        /// <summary>
        /// The get double.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// The get double.
        /// </returns>
        public double GetDouble(string field)
        {
            return GetDouble(field, default(double));
        }


        /// <summary>
        /// The get double.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <returns>
        /// The get double.
        /// </returns>
        public double GetDouble(string field, double defaultValue)
        {
            int index = GetOrdinal(field);
            return _dataReader.IsDBNull(index) ? defaultValue : _dataReader.GetDouble(index);
        }


        /// <summary>
        /// The get enum null.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <typeparam name="T">
        /// </typeparam>
        /// <returns>
        /// </returns>
        public T? GetEnumNull<T>(string field) where T : struct
        {
            int index = GetOrdinal(field);

            if (_dataReader.IsDBNull(index))
            {
                return null;
            }
            else
            {
                string valueAsString = _dataReader.GetString(index);
                return (T)Enum.Parse(typeof(T), valueAsString);
            }
        }


        /// <summary>
        /// The get enum.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <typeparam name="T">
        /// </typeparam>
        /// <returns>
        /// </returns>
        public T GetEnum<T>(string field) where T : struct
        {
            var index = GetOrdinal(field);
            T result;

            if (_dataReader.IsDBNull(index))
            {
                result = default(T);
            }
            else
            {
                var value = _dataReader.GetValue(index);
                result = (T)Enum.Parse(typeof(T), value.ToString());
            }

            return result;
        }


        /// <summary>
        /// The get field count.
        /// </summary>
        /// <returns>
        /// The get field count.
        /// </returns>
        public int GetFieldCount()
        {
            return _dataReader.FieldCount;
        }


        /// <summary>
        /// The get float.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// The get float.
        /// </returns>
        public float GetFloat(string field)
        {
            return GetFloat(field, default(float));
        }


        /// <summary>
        /// The get float.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <returns>
        /// The get float.
        /// </returns>
        public float GetFloat(string field, float defaultValue)
        {
            int index = GetOrdinal(field);
            return _dataReader.IsDBNull(index) ? defaultValue : _dataReader.GetFloat(index);
        }


        /// <summary>
        /// The get guid.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// </returns>
        public Guid GetGuid(string field)
        {
            return GetGuid(field, default(Guid));
        }


        /// <summary>
        /// The get guid.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <returns>
        /// </returns>
        public Guid GetGuid(string field, Guid defaultValue)
        {
            int index = GetOrdinal(field);
            return _dataReader.IsDBNull(index) ? defaultValue : _dataReader.GetGuid(index);
        }


        /// <summary>
        /// The get int 16.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// The get int 16.
        /// </returns>
        public short GetInt16(string field)
        {
            return GetInt16(field, default(short));
        }


        /// <summary>
        /// The get int 16.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <returns>
        /// The get int 16.
        /// </returns>
        public short GetInt16(string field, short defaultValue)
        {
            int index = GetOrdinal(field);
            return _dataReader.IsDBNull(index) ? defaultValue : _dataReader.GetInt16(index);
        }


        /// <summary>
        /// The get int 32.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// The get int 32.
        /// </returns>
        public int GetInt32(string field)
        {
            return GetInt32(field, default(int));
        }


        /// <summary>
        /// The get int 32.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <returns>
        /// The get int 32.
        /// </returns>
        public int GetInt32(string field, int defaultValue)
        {
            int index = GetOrdinal(field);
            return _dataReader.IsDBNull(index) ? defaultValue : _dataReader.GetInt32(index);
        }


        /// <summary>
        /// The get nullable int 32.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// The get nullable int 32.
        /// </returns>
        public int? GetInt32Null(string field)
        {
            return GetValue<int?>(field, null);
        }


        /// <summary>
        /// The get int 64.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// The get int 64.
        /// </returns>
        public long GetInt64(string field)
        {
            return GetInt64(field, default(long));
        }


        /// <summary>
        /// The get int 64.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <returns>
        /// The get int 64.
        /// </returns>
        public long GetInt64(string field, long defaultValue)
        {
            int index = GetOrdinal(field);
            return _dataReader.IsDBNull(index) ? defaultValue : _dataReader.GetInt64(index);
        }


        /// <summary>
        /// The get name.
        /// </summary>
        /// <param name="index">
        /// The index.
        /// </param>
        /// <returns>
        /// The get name.
        /// </returns>
        public string GetName(int index)
        {
            return _dataReader.GetName(index);
        }


        /// <summary>
        /// The get string.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// The get string.
        /// </returns>
        public string GetString(string field)
        {
            var ret = GetString(field, default(string));
            if (!string.IsNullOrEmpty(ret))
                ret = ret.Replace("'", "''");
            return ret;
        }


        /// <summary>
        /// The get string.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <returns>
        /// The get string.
        /// </returns>
        public string GetString(string field, string defaultValue)
        {
            int index = GetOrdinal(field);
            return (index < 0 || _dataReader.IsDBNull(index)) ? defaultValue : _dataReader.GetString(index);
        }


        /// <summary>
        /// The get value.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <typeparam name="T">
        /// </typeparam>
        /// <returns>
        /// </returns>
        public T GetValue<T>(string field)
        {
            return GetValue(field, default(T));
        }


        /// <summary>
        /// The get value.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <typeparam name="T">
        /// </typeparam>
        /// <returns>
        /// </returns>
        public T GetValue<T>(string field, T defaultValue)
        {
            int index = GetOrdinal(field);
            return GetValue(index, defaultValue);
        }


        /// <summary>
        /// The get value.
        /// </summary>
        /// <param name="index">
        /// The index.
        /// </param>
        /// <typeparam name="T">
        /// </typeparam>
        /// <returns>
        /// </returns>
        public T GetValue<T>(int index)
        {
            return GetValue(index, default(T));
        }


        /// <summary>
        /// The get value.
        /// </summary>
        /// <param name="index">
        /// The index.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <typeparam name="T">
        /// </typeparam>
        /// <returns>
        /// </returns>
        public T GetValue<T>(int index, T defaultValue)
        {
            return _dataReader.IsDBNull(index) ? defaultValue : (T)_dataReader.GetValue(index);
        }


        /// <summary>
        /// The get value.
        /// </summary>
        /// <param name="index">
        /// The index.
        /// </param>
        /// <returns>
        /// The get value.
        /// </returns>
        public object GetValue(int index)
        {
            return GetValue(index, null);
        }


        /// <summary>
        /// The get value.
        /// </summary>
        /// <param name="index">
        /// The index.
        /// </param>
        /// <param name="defaultValue">
        /// The default value.
        /// </param>
        /// <returns>
        /// The get value.
        /// </returns>
        public object GetValue(int index, object defaultValue)
        {
            return _dataReader.IsDBNull(index) ? defaultValue : _dataReader.GetValue(index);
        }


        /// <summary>
        /// The is not null.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// The is not null.
        /// </returns>
        public bool IsNotNull(string field)
        {
            return !IsNull(field);
        }


        /// <summary>
        /// The is not null.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// The is not null.
        /// </returns>
        public bool IsNotNull(int field)
        {
            return !IsNull(field);
        }


        /// <summary>
        /// The is null.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// The is null.
        /// </returns>
        public bool IsNull(string field)
        {
            return _dataReader.IsDBNull(GetOrdinal(field));
        }


        /// <summary>
        /// The is null.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// The is null.
        /// </returns>
        public bool IsNull(int field)
        {
            return _dataReader.IsDBNull(field);
        }


        /// <summary>
        /// The next result.
        /// </summary>
        /// <returns>
        /// The next result.
        /// </returns>
        public bool NextResult()
        {
            _rowSchema.Clear();
            return _dataReader.NextResult();
        }


        /// <summary>
        /// The read.
        /// </summary>
        /// <returns>
        /// The read.
        /// </returns>
        public bool Read()
        {
            return _dataReader.Read();
        }

        #endregion

        #region Methods

        /// <summary>
        /// The get ordinal.
        /// </summary>
        /// <param name="field">
        /// The field.
        /// </param>
        /// <returns>
        /// The get ordinal.
        /// </returns>
        /// <exception cref="ArgumentException">
        /// <c>ArgumentException</c>.
        /// </exception>
        private int GetOrdinal(string field)
        {
            int index;
            if (_rowSchema.TryGetValue(field, out index))
            {
                return index;
            }
            else
            {
                try
                {
                   index = _dataReader.GetOrdinal(field);
                }
                catch (IndexOutOfRangeException e)
                {
                    //throw new ArgumentException(string.Format("Invalid column name '{0}'", field), "field", e);
                    index = -1;
                }

                _rowSchema.Add(field, index);
                return index;
            }
        }

        #endregion
    }
}