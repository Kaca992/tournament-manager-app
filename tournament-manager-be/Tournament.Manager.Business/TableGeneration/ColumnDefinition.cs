using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tournament.Manager.Common.Enums;

namespace Tournament.Manager.Business.TableGeneration
{
    [AttributeUsage(AttributeTargets.Property)]
    public class ColumnDefinition : Attribute
    {
        public string DisplayText { get; set; }
        public string HeaderKey { get; set; }

        public TextAlignEnum TextAlignType { get;set;}
        public string TextAlign
        {
            get
            {
                switch(TextAlignType)
                {
                    case TextAlignEnum.Left:
                        return "left";
                    case TextAlignEnum.Center:
                        return "center";
                    case TextAlignEnum.Right:
                        return "right";
                    default: return "center";
                }
            }
        }
        public int? Columns { get; set; }

        public ColumnDefinition(string displayText, int? columns = null)
        {
            DisplayText = displayText;
            Columns = columns;
            TextAlignType = TextAlignEnum.Center;
        }

        public ColumnDefinition()
        {
            TextAlignType = TextAlignEnum.Center;
            Columns = null;
        }
    }
}
