using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using Umbraco.Web.Models;

namespace WebBlocks.Extensions
{
    public static class HtmlWebBlocksLiveEdit
    {
        public static string WebBlocksLiveEdit(this HtmlHelper<RenderModel> html, int blocksRootNode)
        {
            ViewDataDictionary viewData = new ViewDataDictionary();
            viewData.Add("wbBlocksRootNode", blocksRootNode);
            html.RenderPartial("LiveEditRender", null, viewData);
            return "";
        }
    }
}