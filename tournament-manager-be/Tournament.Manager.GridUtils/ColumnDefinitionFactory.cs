using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;

namespace Tournament.Manager.GridUtils
{
    public class ColumnDefinitionFactory
    {
        #region Column Definition Generation
        public static List<ColumnDefinition> ExtractColumnDefinitions(Type objectType)
        {
            List<ColumnDefinition> columns = new List<ColumnDefinition>();
            var props = objectType.GetProperties();
            foreach (var prop in props)
            {
                var propattr = prop.GetCustomAttributes(true);
                object attr = (from row in propattr
                               where row.GetType() == typeof(ColumnDefinition)
                               select row).FirstOrDefault();

                ColumnDefinition columnDefiniton = (ColumnDefinition)attr;

                if (columnDefiniton == null)
                {
                    continue;
                }

                populateGenericColumnDefinitonValues(columnDefiniton, prop.Name);
                columns.Add(columnDefiniton);
            }

            return columns;
        }

        private static void populateGenericColumnDefinitonValues(ColumnDefinition columnDefinition, string propName)
        {
            columnDefinition.PropertyName = propName;
            if (columnDefinition.DisplayText == null)
            {
                columnDefinition.DisplayText = splitByCase(propName);
            }

            if (columnDefinition.HeaderKey == null)
            {
                columnDefinition.HeaderKey = Char.ToLowerInvariant(propName[0]) + propName.Substring(1);
            }
        }
        #endregion

        public static DataTable GenerateDataTable<T>(List<T> values)
        {
            if (values?.Any() == false)
            {
                return null;
            }

            DataTable table = new DataTable();
            var columns = ExtractColumnDefinitions(typeof(T));
            foreach(var column in columns)
            {
                var tableColumn = table.Columns.Add(column.PropertyName, typeof(string));
                tableColumn.Caption = column.DisplayText;
            }

            foreach(var value in values)
            {
                var row = table.NewRow();
                table.Rows.Add((populateRowData(row, value, columns)));
            }

            return table;

        }

        private static DataRow populateRowData(DataRow row, object data, List<ColumnDefinition> columns)
        {
            foreach(var column in columns)
            {
                row[column.PropertyName] = getPropValue(data, column.PropertyName);
            }

            return row;
        }

        private static string getPropValue(object src, string propName)
        {
            var value = src.GetType().GetProperty(propName).GetValue(src);
            if (value == null)
            {
                return string.Empty;
            }
            return value.ToString();
        }

        private static string splitByCase(string source)
        {
            return string.Join(" ", Regex.Split(source, @"(?<!^)(?=[A-Z](?![A-Z]|$))"));
        }
    }
}
