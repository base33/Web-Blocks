using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Interfaces;
using System.Web.Mvc.Html;
using System.Web.Mvc;

namespace WebBlocks.SandboxV7.CustomContainers
{
    public class YouTubeChannelContainer : IContainerRenderer
    {
        public void Render(IContainer container, System.Web.Mvc.HtmlHelper<Umbraco.Web.Models.RenderModel> html)
        {
            ViewDataDictionary dictionary = new ViewDataDictionary();
            dictionary.Add("Blocks", container.Blocks);
            html.RenderPartial("YouTubeVideoChannel", null, dictionary);
        }
    }
}