using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.HtmlControls;
using Umbraco.Core;
using Umbraco.Web;
using WebBlocks.Utilities.WebBlocks;
using umbraco.cms.businesslogic.macro;
using umbraco.cms.businesslogic.web;
using umbraco.NodeFactory;
using WebBlocks.BusinessLogic.Interfaces;
using WebBlocks.Views.RenderingEngines;
using WebBlocks.Models.Angular;
using CacheHelper = WebBlocks.Utilities.Cache.CacheHelper;
using umbraco.BusinessLogic;
using umbraco.presentation.preview;
using System.Xml;
using Umbraco.Core.Models;
using Umbraco.Web.Models;
using WebBlocks.Utilities.Umbraco;
using System.IO;
using System.Web.Mvc.Html;
using WebBlocks.API;
using WebBlocks.Helpers;
using Newtonsoft.Json;
using WebBlocks.Interfaces;
using WebBlocks.Controllers;

namespace WebBlocks.Views
{
    public class BlockView
    {
        /// <summary>
        /// Renders the block
        /// </summary>
        /// <returns>rendered html for the block</returns>
        public string Render(IBlock block, HtmlHelper html)
        {
            if (!HttpContext.Current.Response.IsClientConnected)
                return "";

            if (block is ContentBlock)
                return RenderNodeBlock(block as ContentBlock, html);
            
            return RenderWysiwygBlock(block as WysiwygBlock, html);
        }

        protected string RenderNodeBlock(ContentBlock block, HtmlHelper html)
        {
            //check if the node exists
            if (block.Content == null) return null;

            //set the block model for the view to access
            WebBlocksUtility.CurrentBlockContent = block.Content;

            //initialise WebBlocksAPI for the view
            WebBlocksAPI blockInstanceAPI = new WebBlocksAPI();
            blockInstanceAPI.CssClasses = new List<string>();
            blockInstanceAPI.BlockElement = "";
            blockInstanceAPI.BlockAttributes = new Dictionary<string, string>();

            //set up the rendering engine for the view
            IRenderingEngine renderingEngine = ResolveRenderingEngine(block);

            //if rendering engine is null then the document doesn't exist anymore
            if (renderingEngine == null || block.Content == null) return "";

            string renderedContent = "";

            //render
            renderedContent = renderingEngine.Render(html);

            List<string> CssClasses = blockInstanceAPI.CssClasses;
            

            string blockElement = blockInstanceAPI.BlockElement ?? "div";
            blockElement = blockElement != "" ? blockElement : "div";

            Dictionary<string, string> blockAttributeDictionary = blockInstanceAPI.BlockAttributes;
            string blockAttributes = string.Join(" ", blockAttributeDictionary.Keys.Select(c => c + "='" + blockAttributeDictionary[c] + "'"));

            string blockClass = string.Format("{0}{1}{0}{2}{3}{4}", 
                block.ViewModel.Classes.Length > 0 ? " " : "", 
                block.ViewModel.Classes,
                WebBlocksUtility.CurrentBlockContent.GetPropertyValue("cssClasses") ?? "",
                CssClasses.Any() ? " " : "",
                string.Join(" ", CssClasses));

            renderedContent = string.Format("<{0} class='{1}'{2}>{3}</{0}>", 
                blockElement, blockClass, blockAttributes, renderedContent);

            return renderedContent;
        }

        protected string RenderWysiwygBlock(WysiwygBlock block, HtmlHelper html)
        {
            //TODO: set wysiwyg element type from container
            string webBlocksId = WebBlocksUtility.IsInBuilder ? string.Format(" wbid='{0}'", block.Id) : "";

            string blockClass = string.Format("pageWysiwygBlock{0}{1}", block.ViewModel.Classes.Length > 0 ? " " : "", block.ViewModel.Classes);

            blockClass = WebBlocksUtility.IsInBuilder ? "block " + blockClass : blockClass;

            string blockTemplateAttribute = WebBlocksUtility.IsInBuilder ? string.Format(" templateblock='{0}'", block.IsTemplateBlock.ToString().ToLower()) : "";
            string blockDeletedAttribute = WebBlocksUtility.IsInBuilder && block.IsDeletedBlock ? " deletedBlock='deleted' style='display:none;visibilty:hidden;'" : "";

            TinyMCE tinyMceHelper = new TinyMCE();

            string blockContent = WebBlocksUtility.IsInBuilder ? block.Content : umbraco.library.RenderMacroContent(tinyMceHelper.ReplaceMacroTags(HttpUtility.UrlDecode(block.Content)), WebBlocksUtility.CurrentPageNodeId);

            if (!WebBlocksUtility.IsInBuilder)
                blockContent = LocalLinkHelper.ResolveLocalLinks(blockContent);

            return string.Format("<{0}{1} class='{2}'{3}{4}>{5}</{0}>", block.ViewModel.Tag, webBlocksId, blockClass, blockTemplateAttribute, blockDeletedAttribute,
                HttpUtility.UrlDecode(blockContent));
        }

        protected IRenderingEngine ResolveRenderingEngine(ContentBlock block)
        {
            IRenderingEngine engine;

            if(BlockControllerCache.Controllers.Contains(block.ContentTypeAlias))
            {
                engine = new ControllerRenderingEngine()
                {
                    ControllerName = block.Content.ContentType.Alias
                };
            }
            else
            {
                //resolve with partial view
                engine = new PartialViewRenderingEngine
                {
                    ScriptName = block.Content.ContentType.Alias
                };
            }
            

            return engine;
        }

        public void RenderPreview(HtmlHelper html)
        {
            string htmlContent = Render(new ContentBlock(WebBlocksUtility.CurrentBlockContent.Id), html);

            html.ViewContext.Writer.Write(htmlContent);
        }
    }
}
