using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using umbraco.BusinessLogic;
using Umbraco.Web;
using Umbraco.Web.BaseRest;
using WebBlocks.Providers;

namespace WebBlocks.BaseService
{
    [RestExtension("WebBlocks")]
    public class WebBlocksBase
    {
        [RestExtensionMethod(ReturnXml = false)]
        public static string GetBlockDocType()
        {
            int nodeId = int.Parse(HttpContext.Current.Request.QueryString["id"]);
            string docType = "";
            if (User.GetCurrent() != null)
            {
                docType = UmbracoContext.Current.Application.Services.ContentService.GetById(nodeId).ContentType.Alias;
            }
            return docType;
        }

        [RestExtensionMethod(ReturnXml = false)]
        public static string SaveWebBlocks()
        {
            int nodeId = int.Parse(HttpContext.Current.Request.QueryString["pageId"]);
            string webBlocksJSON = HttpContext.Current.Request.Form["wbJSON"];

            if (User.GetCurrent() != null)
            {
                var node = UmbracoContext.Current.Application.Services.ContentService.GetById(nodeId);
                node.SetValue("webBlocks", webBlocksJSON);
            }
            return "";
        }

        [RestExtensionMethod(ReturnXml = false)]
        public static string SaveAndPublishWebBlocks()
        {
            int nodeId = int.Parse(HttpContext.Current.Request.QueryString["pageId"]);
            string webBlocksJSON = HttpContext.Current.Request.Form["wbJSON"];

            if (User.GetCurrent() != null)
            {
                var node = UmbracoContext.Current.Application.Services.ContentService.GetById(nodeId);
                node.SetValue("webBlocks", webBlocksJSON);
                UmbracoContext.Current.Application.Services.ContentService.Publish(node, User.GetCurrent().Id);
            }
            
            return "";
        }
    }
}