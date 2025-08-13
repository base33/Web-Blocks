using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using WebBlocks.BusinessLogic.Interfaces;

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
                if (HttpContext.Current.IsDebuggingEnabled)
                    return HttpUtility.HtmlEncode("Block Exception: " + ex);
                else
                    return string.Empty;
            }
        }
    }
}