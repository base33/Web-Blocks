using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web;
using Umbraco.Web.Models;
using WebBlocks.Views;
using WebBlocks.Interfaces;
using WebBlocks.Model;
using WebBlocks.Utilities.Umbraco;
using WebBlocks.Utilities.WebBlocks;
using System.Web.Mvc.Html;

namespace Sandbox.Website.CustomContainers
{
    public class SliderContainer : IContainerRenderer
    {
        public void Render(IContainer container, HtmlHelper<RenderModel> html)
        {
            ViewDataDictionary dictionary = new ViewDataDictionary();
            dictionary.Add("Blocks", container.Blocks);
            html.RenderPartial("SliderContainerRenderer", null, dictionary);
        }
    }
}