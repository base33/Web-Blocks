using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Core.Services;
using Umbraco.Web;
using Umbraco.Web.Models;
using WebBlocks.BusinessLogic.Interfaces;
using umbraco.MacroEngines;
using umbraco.NodeFactory;
using umbraco.cms.businesslogic.macro;
using System.Web.Mvc.Html;
using WebBlocks.Utilities.WebBlocks;

namespace WebBlocks.Views.RenderingEngines
{
    public class PartialViewRenderingEngine : IRenderingEngine
    {
        public string ScriptName { get; set; }

        public string Render(HtmlHelper html, object model = null)
        {
            try
            {
                return model != null ? html.Partial(ScriptName, model, html.ViewData).ToHtmlString() : html.Partial(ScriptName, html.ViewData).ToHtmlString();
            }
            catch(Exception ex)
            {
                return HttpUtility.HtmlEncode("Block Exception:" + ex.ToString());
            }
        }
    }
}