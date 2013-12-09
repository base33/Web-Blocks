using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using umbraco.BusinessLogic;
using Umbraco.Web;
using Umbraco.Web.BaseRest;
using WebBlocks.Providers;
using WebBlocks.Utilities.Umbraco;

namespace WebBlocks.BaseService
{
    /// <summary>
    /// Restful service for Web Blocks in the backoffice and front end live edit
    /// </summary>
    [RestExtension("WebBlocks")]
    public class WebBlocksBase
    {
        /// <summary>
        /// Gets the block type/node type alias for a block based on a passed node id
        /// /base/WebBlocks/GetBlockDocType?id={node id}
        /// </summary>
        /// <returns></returns>
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

        /// <summary>
        /// Saves the json to the page node
        /// /base/WebBlocks/SaveWebBlocks?pageId={page node id}
        /// </summary>
        /// <returns></returns>
        [RestExtensionMethod(ReturnXml = false)]
        public static string SaveWebBlocks()
        {
            if (User.GetCurrent() == null) return "";
            int nodeId = int.Parse(HttpContext.Current.Request.QueryString["pageId"]);
            string webBlocksJSON = HttpContext.Current.Request.Form["wbJSON"];
            webBlocksJSON = LocalLinkHelper.ResolveLocalLinks(webBlocksJSON);
            var node = UmbracoContext.Current.Application.Services.ContentService.GetById(nodeId);
            node.SetValue("webBlocks", webBlocksJSON);
            return "";
        }

        /// <summary>
        /// Saves the json to the page node and publishes it
        /// /base/WebBlocks/SaveAndPublishWebBlocks?pageId={page node id}
        /// </summary>
        /// <returns></returns>
        [RestExtensionMethod(ReturnXml = false)]
        public static string SaveAndPublishWebBlocks()
        {
            if (User.GetCurrent() == null) return "";

            int nodeId = int.Parse(HttpContext.Current.Request.QueryString["pageId"]);
            string webBlocksJSON = HttpContext.Current.Request.Form["wbJSON"];
            webBlocksJSON = LocalLinkHelper.ResolveLocalLinks(webBlocksJSON);
            var node = UmbracoContext.Current.Application.Services.ContentService.GetById(nodeId);
            node.SetValue("webBlocks", webBlocksJSON);
            UmbracoContext.Current.Application.Services.ContentService.Publish(node, User.GetCurrent().Id);
            
            return "";
        }
    }
}