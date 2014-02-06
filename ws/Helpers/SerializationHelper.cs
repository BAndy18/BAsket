// --------------------------------------------------------------------------------------------------------------------
// <copyright file="SerializationHelper.cs" company="Aramark Corporation">
//   Copyright (c) Aramark Corporation 2011
// </copyright>
// <summary>
//   The serialization helper.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

#region Namespace Imports



#endregion

namespace BAsketWS.Helpers
{
	/// <summary>
	/// The serialization helper.
	/// </summary>
	public static class SerializationHelper
	{
        //public static string SerializeSearchQuery<T>(T query)
        //    where T : class
        //{
        //    string result = null;

        //    if (query != null && query is SearchQueryObject)
        //    {
        //        var clonedQuery = (SearchQueryObject)(query as SearchQueryObject).Clone();
        //        var filters = clonedQuery.Filter;

        //        if (filters != null)
        //        {
        //            foreach (var filter in filters)
        //            {
        //                foreach (var group in filter.Groups)
        //                {
        //                    foreach (var oper in group.Operators)
        //                    {
        //                        if (!string.IsNullOrEmpty(oper.Value))
        //                            oper.Value = "." + oper.Value + ".";

        //                        if (!string.IsNullOrEmpty(oper.Value2))
        //                            oper.Value2 = "." + oper.Value2 + ".";
        //                    }
        //                }
        //            }
        //        }

        //        result = Serialize(clonedQuery);
        //    }
        //    else
        //    {
        //        result = Serialize(query);
        //    }

        //    return result;
        //}

        //public static string Serialize<T>(T obj)
        //    where T : class
        //{
        //    var type = typeof(T);

        //    // todo mk
        //    if (obj == null)
        //    {
        //        if (type == typeof(SearchQueryObject))
        //            obj = new SearchQueryObject() as T;
        //    }

        //    var builder = new StringBuilder();
        //    var serializer = new XmlSerializer(type);

        //    using (var writer = XmlWriter.Create(builder, new XmlWriterSettings { Indent = false, OmitXmlDeclaration = true }))
        //    {
        //        var namespaces = new XmlSerializerNamespaces();
        //        namespaces.Add(string.Empty, string.Empty);
        //        serializer.Serialize(writer, obj, namespaces);
        //    }

        //    var result = builder.ToString();
        //    return result;
        //}

        ///// <summary>
        ///// The serialize data contract.
        ///// </summary>
        ///// <param name="obj">
        ///// The obj.
        ///// </param>
        ///// <typeparam name="T">
        ///// </typeparam>
        ///// <returns>
        ///// The serialize data contract.
        ///// </returns>
        //public static string SerializeDataContract<T>(T obj)
        //{
        //    string result;
        //    var serializer = new DataContractSerializer(typeof(T));

        //    using (var stringWriter = new StringWriter())
        //    {
        //        using (var xmlWriter = XmlWriter.Create(stringWriter))
        //        {
        //            serializer.WriteObject(xmlWriter, obj);
        //        }

        //        result = stringWriter.ToString();
        //    }

        //    return result;
        //}

        ///// <summary>
        ///// The deserialize data contract.
        ///// </summary>
        ///// <param name="xml">
        ///// The xml.
        ///// </param>
        ///// <typeparam name="T">
        ///// </typeparam>
        ///// <returns>
        ///// </returns>
        //public static T DeserializeDataContract<T>(string xml)
        //{
        //    T result;
        //    var serializer = new DataContractSerializer(typeof(T));

        //    using (var stringReader = new StringReader(xml))
        //    {
        //        using (var xmlReader = XmlReader.Create(stringReader))
        //        {
        //            result = (T)serializer.ReadObject(xmlReader);
        //        }
        //    }

        //    return result;
        //}
	}
}