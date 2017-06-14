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
        public MacroModel Macro { get; set; }
        public Node CurrentNode { get; set; }

        public string Render(HtmlHelper html)
		{
			return html.Partial(Macro.ScriptName, html.ViewData).ToHtmlString();
		}
	}
}