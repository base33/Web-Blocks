using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using Umbraco.Web.Models;
using WebBlocks.Utilities.WebBlocks;

namespace WebBlocks.Extensions
{
    public static class HtmlWebBlocksLiveEdit
    {
        /// <summary>
        /// Adds live edit to the web page
        /// Use: @Html.WebBlocksLiveEdit(1055, "Wysiwyg")
        /// </summary>
        /// <param name="html"></param>
        /// <param name="blocksRootNode">Root node id for the blocks</param>
        /// <param name="stylesheetId">The wysiwyg stylesheet for TinyMCE</param>
        /// <returns></returns>
        public static string WebBlocksLiveEdit(this HtmlHelper<RenderModel> html, int blocksRootNode, int stylesheetId)
        {
            ViewDataDictionary viewData = new ViewDataDictionary();
            viewData.Add("wbBlocksRootNode", blocksRootNode);
            viewData.Add("wbStylesheetId", stylesheetId);
            html.RenderPartial("LiveEditRender", null, viewData);
            return "";
        }
    }
}