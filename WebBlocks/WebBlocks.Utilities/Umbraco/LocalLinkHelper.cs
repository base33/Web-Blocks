using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using umbraco.NodeFactory;

namespace WebBlocks.Utilities.Umbraco
{
    public class LocalLinkHelper
    {
        public const string LocalLinkRegex = "%7BlocalLink:([0-9]{0,9})%7D";
        
        public static string ResolveLocalLinks(string source)
        {
            Regex regex = new Regex(LocalLinkRegex, RegexOptions.Multiline | RegexOptions.IgnoreCase);
            var matches = regex.Matches(source);
            string result = "";
            int startIndex = 0;
            for (int i = 0; i < matches.Count; i++)
            {
                result += source.Substring(startIndex, matches[i].Groups[0].Index - startIndex);
                result += (new Node(int.Parse(matches[i].Groups[1].Value))).Url.Substring(1);
                startIndex = matches[i].Groups[0].Index + matches[i].Groups[0].Length;
            }
            result += source.Substring(startIndex);
            return result;
        }
    }
}