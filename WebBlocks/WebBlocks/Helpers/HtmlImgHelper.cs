using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using WebBlocks.Models.Angular;
using WebBlocks.Providers;
using WebBlocks.Serialisation;

namespace WebBlocks.Helpers
{
    public class HtmlImgHelper
    {
        /// <summary>
        /// Adds a querystring to all image tags with width and height so that MImageResizer resizes them on request
        /// </summary>
        /// <param name="json">Layout builder json</param>
        /// <returns>Layout builder json</returns>
        public static string ResizeImages(string json)
        {
            LayoutBuilderSerialiser layoutBuilderSerialiser = new LayoutBuilderSerialiser();
            AngularLayoutBuilderModel layoutBuilder = layoutBuilderSerialiser.Deserialise(json);
            List<WysiwygBlock> wysiwygBlocks = (from containerKey in layoutBuilder.Containers.Keys
                                         from b in layoutBuilder.Containers[containerKey].Blocks
                                         where b is WysiwygBlock
                                         select b as WysiwygBlock).ToList();


            foreach (WysiwygBlock block in wysiwygBlocks)
            {
                int offset = 0;
                //match 1 = src, match 2 = width, match 3 = height - explaination eof
                string imgRegex =
                    @"(?i)<img\s(?=[^>]*src=""([^""]*)"")(?=[^>]*width=""([^""]*)"")(?=[^>]*height=""([^""]*)"")[^>]*>";
                block.Content = HttpUtility.HtmlDecode(HttpUtility.UrlDecode(block.Content));
                MatchCollection mc = Regex.Matches(block.Content, imgRegex, RegexOptions.IgnoreCase | RegexOptions.IgnorePatternWhitespace | RegexOptions.Multiline);

                foreach (Match match in mc)
                {
                    string newUrl = string.Format("{0}?width={1}&height={2}&mode=crop",
                        match.Groups[1].Value.Split('?').First(), match.Groups[2].Value, match.Groups[3].Value);

                    string newSrc = block.Content.Substring(0, match.Groups[1].Index + offset);
                    newSrc += newUrl;
                    int urlEndIndex = (match.Groups[1].Index + offset) + match.Groups[1].Length;
                    newSrc += block.Content.Substring(urlEndIndex, block.Content.Length - urlEndIndex);
                    block.Content = newSrc;
                    offset += newUrl.Length - match.Groups[1].Value.Length;
                }
                block.Content = HttpUtility.HtmlEncode(HttpUtility.UrlEncode(block.Content));
            }

            return layoutBuilderSerialiser.Serialise(layoutBuilder);
        }
    }
}