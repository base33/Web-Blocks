using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web.Models;
using Umbraco.Web.Mvc;
using WebBlocks.Utilities.Umbraco;
using WebBlocks.Utilities.WebBlocks;

namespace WebBlocks.SurfaceControllers
{
    public class BlockRenderSurfaceController : SurfaceController
    {
        [ActionName("RenderBlock")]
        public ActionResult RenderBlock()
        {
            int pageId = int.Parse(Request.QueryString["pageId"]);
            int blockId = int.Parse(Request.QueryString["blockId"]);
            WebBlocksUtility.CurrentPageNodeId = pageId;
            WebBlocksUtility.CurrentPageContent = new DynamicPublishedContent(new DynamicContent(pageId));
            WebBlocksUtility.CurrentBlockContent = new DynamicPublishedContent(new DynamicContent(blockId));
            WebBlocksUtility.IsInBuilder = true;
            return PartialView("BlockPreviewRender");
        }
    }
}