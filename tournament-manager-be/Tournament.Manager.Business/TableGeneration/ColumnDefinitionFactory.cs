using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Tournament.Manager.Business.TableGeneration
{
    public class ColumnDefinitionFactory
    {
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
            if (columnDefinition.DisplayText == null)
            {
                columnDefinition.DisplayText = splitByCase(propName);
            }

            if (columnDefinition.HeaderKey == null)
            {
                columnDefinition.HeaderKey = Char.ToLowerInvariant(propName[0]) + propName.Substring(1);
            }
        }

        private static string splitByCase(string source)
        {
            return string.Join(" ", Regex.Split(source, @"(?<!^)(?=[A-Z](?![A-Z]|$))"));
        }
    }
}
