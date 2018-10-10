using System;
using Tournament.Manager.GridUtils.Enums;

namespace Tournament.Manager.GridUtils
{
    [AttributeUsage(AttributeTargets.Property)]
    public class ColumnDefinition : Attribute
    {
        public string PropertyName { get; set; }
        public string DisplayText { get; set; }
        public string HeaderKey { get; set; }
        public bool IsSortable { get; set; }

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

        public ColumnDefinition(string displayText): this()
        {
            DisplayText = displayText;
        }

        public ColumnDefinition()
        {
            TextAlignType = TextAlignEnum.Center;
            Columns = null;
            IsSortable = true;
        }
    }
}
