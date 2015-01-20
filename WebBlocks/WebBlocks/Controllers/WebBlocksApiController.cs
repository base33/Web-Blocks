using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Core.Models;
using Umbraco.Web.Models;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;
using WebBlocks.Models.Navigation;

namespace WebBlocks.Controllers
{
    [PluginController("WebBlocks")]
    public class WebBlocksApiController : UmbracoApiController//UmbracoAuthorizedApiController
    {
        /// <summary>
        /// Url: /umbraco/WebBlocks/WebBlocksApi/GetChildren?id={id} sample: 1052
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public IEnumerable<NavigationItem> GetChildren(int id)
        {
            var contentService = UmbracoContext.Application.Services.ContentService;

            IContent root = contentService.GetById(id);
            
            return root.Children()
                .Select(c => new NavigationItem { Id = c.Id, Name = c.Name, ContentType = c.ContentType.Alias, IconClass = c.ContentType.Icon, HasChildren = c.Children().Any() });
        }

        public WebBlockRenderModel RenderWebBlock(int id)
        {
            //Stream filter = Stream.Null;
            //StreamWriter writer = new StreamWriter(filter);
            //var viewContext = new ViewContext((ControllerContext)this.ControllerContext,
            //    new WebFormView("MyView"),
            //    new ViewDataDictionary(),
            //    new TempDataDictionary(), writer);
            //var helper = new HtmlHelper<RenderModel>(viewContext, new ViewPage());
            return new WebBlockRenderModel();
        }
    }
}