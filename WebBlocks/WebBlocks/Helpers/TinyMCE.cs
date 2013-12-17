using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections;

namespace WebBlocks.Helpers
{
    public class TinyMCE
    {
        public string ReplaceMacroTags(string text)
        {
            while (FindStartTag(text) > -1)
            {
                string result = text.Substring(FindStartTag(text), FindEndTag(text) - FindStartTag(text));
                text = text.Replace(result, GenerateMacroTag(result));
            }
            return text;
        }

        private string GenerateMacroTag(string macroContent)
        {
            string macroAttr = macroContent.Substring(5, macroContent.IndexOf(">") - 5);
            string macroTag = "<?UMBRACO_MACRO ";
            System.Collections.Hashtable attributes = ReturnAttributes(macroAttr);
            System.Collections.IDictionaryEnumerator ide = attributes.GetEnumerator();
            while (ide.MoveNext())
            {
                if (ide.Key.ToString().IndexOf("umb_") != -1)
                {
                    // Hack to compensate for Firefox adding all attributes as lowercase
                    string orgKey = ide.Key.ToString();
                    if (orgKey == "umb_macroalias")
                        orgKey = "umb_macroAlias";

                    macroTag += orgKey.Substring(4, orgKey.Length - 4) + "=\"" +
                                ide.Value.ToString().Replace("\\r\\n", Environment.NewLine) + "\" ";
                }
            }
            macroTag += "/>";
            return macroTag;
        }

        private int FindStartTag(string text)
        {
            string temp = "";
            text = text.ToLower();
            if (text.IndexOf("ismacro=\"true\"") > -1)
            {
                temp = text.Substring(0, text.IndexOf("ismacro=\"true\""));
                return temp.LastIndexOf("<");
            }
            return -1;
        }

        private int FindEndTag(string text)
        {
            string find = "<!-- endumbmacro -->";

            int endMacroIndex = text.ToLower().IndexOf(find);
            string tempText = text.ToLower().Substring(endMacroIndex + find.Length, text.Length - endMacroIndex - find.Length);

            int finalEndPos = 0;
            while (tempText.Length > 5)
                if (tempText.Substring(finalEndPos, 6) == "</div>")
                    break;
                else
                    finalEndPos++;

            return endMacroIndex + find.Length + finalEndPos + 6;
        }

        private Hashtable ReturnAttributes(String tag)
        {
            var h = new Hashtable();
            foreach (var i in Umbraco.Core.XmlHelper.GetAttributesFromElement(tag))
            {
                h.Add(i.Key, i.Value);
            }
            return h;
        }
    }
}
