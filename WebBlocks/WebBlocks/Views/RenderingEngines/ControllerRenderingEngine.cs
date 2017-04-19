using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using WebBlocks.BusinessLogic.Interfaces;

namespace WebBlocks.Views.RenderingEngines
{
    public class ControllerRenderingEngine : IRenderingEngine
    {
        public string ControllerName { get; set; }

        public string Render(HtmlHelper html, object model = null)
        {
            return html.Action("Render", ControllerName).ToString();
        }
    }
}