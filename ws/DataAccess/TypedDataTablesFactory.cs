// --------------------------------------------------------------------------------------------------------------------
// <copyright file="TypedDataTablesFactory.cs" company="Aramark Corporation">
//   Copyright (c) Aramark Corporation 2011
// </copyright>
// <summary>
//   The typed data tables factory.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

#region Namespace Imports

using System.Collections.Generic;
using System.Data;
using System.Linq;



#endregion

namespace BAsketWS.DataAccess
{
    /// <summary>
    /// The typed data tables factory.
    /// </summary>
    public static class TypedDataTablesFactory
    {
        /// <summary>
        /// The create address changes table.
        /// </summary>
        /// <param name="addresses">
        /// The addresses.
        /// </param>
        /// <returns>
        /// </returns>
        //public static DataTable CreateAddressChangesTable(IEnumerable<AddressDetailObject> addresses)
        //{
        //    const string IdColumn = "Id";
        //    const string VersionColumn = "Version";
        //    const string ChangeStatusColumn = "ChangeStatus";
        //    const string TypeColumn = "Type";
        //    const string CityColumn = "City";
        //    const string PostalCodeColumn = "PostalCode";
        //    const string CountryCodeColumn = "CountryCode";
        //    const string StateCodeColumn = "StateCode";
        //    const string Line1Column = "Line1";
        //    const string Line2Column = "Line2";
        //    const string Line3Column = "Line3";

        //    var result = new DataTable("Addresses");
        //    var columns = result.Columns;

        //    columns.Add(IdColumn, typeof(int));
        //    columns.Add(VersionColumn, typeof(int));
        //    columns.Add(ChangeStatusColumn, typeof(int));
        //    columns.Add(TypeColumn, typeof(int));
        //    columns.Add(CityColumn, typeof(string));
        //    columns.Add(PostalCodeColumn, typeof(string));
        //    columns.Add(CountryCodeColumn, typeof(string));
        //    columns.Add(StateCodeColumn, typeof(string));
        //    columns.Add(Line1Column, typeof(string));
        //    columns.Add(Line2Column, typeof(string));
        //    columns.Add(Line3Column, typeof(string));

        //    if (addresses != null && addresses.Any())
        //    {
        //        foreach (var address in addresses)
        //        {
        //            var row = result.NewRow();
        //            result.Rows.Add(row);

        //            row[IdColumn] = address.Id;
        //            row[VersionColumn] = address.Version;
        //            row[ChangeStatusColumn] = address.ChangeStatus;
        //            row[TypeColumn] = address.Type;
        //            row[CityColumn] = address.City;
        //            row[PostalCodeColumn] = address.PostalCode;
        //            row[CountryCodeColumn] = address.CountryCode;
        //            row[StateCodeColumn] = address.StateCode;
        //            row[Line1Column] = address.Line1;
        //            row[Line2Column] = address.Line2;
        //            row[Line3Column] = address.Line3;
        //        }
        //    }

        //    return result;
        //}

        /// <summary>
        /// The create profit center address changes table.
        /// </summary>
        /// <param name="addresses">
        /// The addresses.
        /// </param>
        /// <returns>
        /// </returns>
        //public static DataTable CreateProfitCenterAddressChangesTable(IEnumerable<ProfitCenterAddressDetailObject> addresses)
        //{
        //    const string ProvinceColumn = "Province";
        //    const string CountyColumn = "County";
        //    const string Line4Column = "Line4";
        //    const string Line5Column = "Line5";

        //    var castedAddresses = addresses.Cast<AddressDetailObject>().ToList();
        //    var result = CreateAddressChangesTable(castedAddresses);
        //    var columns = result.Columns;

        //    columns.Add(ProvinceColumn, typeof(string));
        //    columns.Add(CountyColumn, typeof(string));
        //    columns.Add(Line4Column, typeof(string));
        //    columns.Add(Line5Column, typeof(string));

        //    if (addresses != null && addresses.Any())
        //    {
        //        var i = 0;

        //        foreach (var address in addresses)
        //        {
        //            var row = result.Rows[i];

        //            row[ProvinceColumn] = address.Province;
        //            row[CountyColumn] = address.County;
        //            row[Line4Column] = address.Line4;
        //            row[Line5Column] = address.Line5;
        //            i++;
        //        }
        //    }

        //    return result;
        //}

        /// <summary>
        /// The create int table.
        /// </summary>
        /// <param name="values">
        /// The values.
        /// </param>
        /// <returns>
        /// </returns>
        public static DataTable CreateIntTable(IEnumerable<int> values)
        {
            const string ValueColumn = "Value";

            var result = new DataTable("IntValues");
            var columns = result.Columns;

            columns.Add("Value", typeof(int));

            if (values != null && values.Any())
            {
                foreach (var value in values)
                {
                    var row = result.NewRow();
                    result.Rows.Add(row);

                    row[ValueColumn] = value;
                }
            }

            return result;
        }
    }
}