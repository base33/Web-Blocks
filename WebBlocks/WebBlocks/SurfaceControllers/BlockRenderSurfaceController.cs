using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web;
using Umbraco.Web.Models;
using Umbraco.Web.Mvc;
using WebBlocks.API;
using WebBlocks.Helpers;
using WebBlocks.Providers;
using WebBlocks.Utilities.Umbraco;
using WebBlocks.Utilities.WebBlocks;
using UM = Umbraco;

namespace WebBlocks.SurfaceControllers
{
    public class BlockRenderSurfaceController : SurfaceController
    {
        /// <summary>
        /// Renders a block based on a given block node id
        /// </summary>
        /// <returns></returns>
        [ActionName("RenderBlock")]
        public ActionResult RenderBlock()
        {
            if (!BackofficeUserHelper.IsUserAuthenticated) throw new HttpException(401, "Unauthorized");

            WebBlocksAPI blockInstanceApi = new WebBlocksAPI();
            blockInstanceApi.BlockElement = "div";
            blockInstanceApi.BlockAttributes = new Dictionary<string, string>();
            blockInstanceApi.CssClasses = new List<string>();

            int pageId = int.Parse(Request.QueryString["pageId"]);
            string blockGuid = Request.QueryString["blockGuid"];
            
            WebBlocksUtility.CurrentPageContent = PublishedContentProvider.Load(pageId);
            WebBlocksUtility.CurrentPageNodeId = pageId;
            WebBlocksUtility.CurrentBlockContent = PublishedContentProvider.Load(blockGuid);

            HttpContext.Items["pageId"] = pageId.ToString();
            
            return PartialView("BlockPreviewRender");
        }
    }
}