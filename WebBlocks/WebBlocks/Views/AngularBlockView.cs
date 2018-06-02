using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web;
using WebBlocks.API;
using WebBlocks.BusinessLogic.Interfaces;
using WebBlocks.Controllers;
using WebBlocks.Helpers;
using WebBlocks.Interfaces;
using WebBlocks.Models.Angular;
using WebBlocks.Utilities.Umbraco;
using WebBlocks.Utilities.WebBlocks;
using WebBlocks.Views.RenderingEngines;

namespace WebBlocks.Views
{
    public class AngularBlockView
    {
        /// <summary>
        /// Renders the block
        /// </summary>
        /// <returns>rendered html for the block</returns>
        public AngularBlock Render(IBlock block, HtmlHelper html)
        {
            if (!HttpContext.Current.Response.IsClientConnected)
                return block as AngularBlock;
			
			if (block is ContentBlock)
			{
				return RenderContentBlock(block as ContentBlock, html);
			}

            if (block is ElementBlock)
                return RenderElementBlock(block as ElementBlock, html);

            if (block is WysiwygBlock)
                return RenderWysiwygBlock(block as WysiwygBlock, html);
            
            return block as AngularBlock;
        }

        protected AngularBlock RenderElementBlock(ElementBlock block, HtmlHelper html)
        {
            string webBlocksId = WebBlocksUtility.IsInBuilder ? string.Format(" wbid='{0}'", block.Id) : "";

            string blockClass = string.Format("pageWysiwygBlock{0}{1}", block.ViewModel.Classes.Length > 0 ? " " : "", block.ViewModel.Classes);

            blockClass = WebBlocksUtility.IsInBuilder ? "block " + blockClass : blockClass;

            string blockTemplateAttribute = WebBlocksUtility.IsInBuilder ? string.Format(" templateblock='{0}'", block.IsTemplateBlock.ToString().ToLower()) : "";
            string blockDeletedAttribute = WebBlocksUtility.IsInBuilder && block.IsDeletedBlock ? " deletedBlock='deleted' style='display:none;visibilty:hidden;'" : "";

            WebBlocksAPI blockContext = new WebBlocksAPI();

            //add a node block to the angularjs containers model
            var containersBuilder = AngularContainersBuilder.Load();
            var angularBlock = new ElementBlock();
            angularBlock.Id = block.Id;
            angularBlock.Name = block.Class;
            angularBlock.Class = block.Class;
            angularBlock.SortOrder = block.SortOrder;
            angularBlock.IsDeletedBlock = block.IsDeletedBlock;
            angularBlock.IsTemplateBlock = block.IsTemplateBlock;
            angularBlock.TemplateContainer = block.TemplateContainer;
            angularBlock.ViewModel = new AngularBlockViewModel()
            {
                Tag = block.ViewModel.Tag,
                Attributes = new List<IBlockElementAttribute>(),
                Classes = block.Class,
                Html = "",
                ShouldCompile = true
            };

            foreach(var child in block.Children)
            {
                blockContext.ParentBlock = angularBlock;
                angularBlock.Children.Add(Render(child, html));
            }

            return angularBlock;
        }

        protected AngularBlock RenderContentBlock(ContentBlock block, HtmlHelper html)
        {
            //check if the node exists
            if (block.Content == null || block.Content.ContentType == null) return null;

            //set the block model for the view to access
            WebBlocksUtility.CurrentBlockContent = block.Content;

            //initialise WebBlocksAPI for the view
            WebBlocksAPI blockInstanceAPI = new WebBlocksAPI();
            blockInstanceAPI.Block = block;
            blockInstanceAPI.CssClasses = new List<string>();
            blockInstanceAPI.BlockElement = "";
            blockInstanceAPI.BlockAttributes = new Dictionary<string, string>();

            //set up the rendering engine for the view
            IRenderingEngine renderingEngine = ResolveRenderingEngine(block);

            //if rendering engine is null then the document doesn't exist anymore
            if (renderingEngine == null || block.Content == null) return block;
            
            string renderedContent = "";

            //render
            renderedContent = renderingEngine.Render(html);

            List<string> CssClasses = blockInstanceAPI.CssClasses;
            

            string blockElement = blockInstanceAPI.BlockElement ?? "div";
            blockElement = blockElement != "" ? blockElement : "div";

            Dictionary<string, string> blockAttributeDictionary = blockInstanceAPI.BlockAttributes;
            string blockAttributes = string.Join(" ", blockAttributeDictionary.Keys.Select(c => c + "='" + blockAttributeDictionary[c] + "'"));

            string blockClass = string.Format("{0}{1}{0}{2}{3}", 
                block.ViewModel.Classes.Length > 0 ? " " : "", 
                block.ViewModel.Classes.Length,
                CssClasses.Any() ? " " : "",
                String.Join(" ", CssClasses));

            //add a node block to the angularjs containers model
            var containersBuilder = AngularContainersBuilder.Load();
            var angularBlock = new ContentBlock();
            angularBlock.Id = block.Id;
            angularBlock.Name = block.Content.Name;
            angularBlock.SortOrder = block.SortOrder;
            angularBlock.IsDeletedBlock = block.IsDeletedBlock;
            angularBlock.IsTemplateBlock = block.IsTemplateBlock;
            angularBlock.TemplateContainer = block.TemplateContainer;
            angularBlock.ContentTypeAlias = block.Content.ContentType.Alias;
            angularBlock.ViewModel = new AngularBlockViewModel() 
            {
                Tag = blockElement,
                Attributes = blockAttributeDictionary.Select(a => new AngularElementAttribute() { Name = a.Key, Value = a.Value }).Cast<IBlockElementAttribute>().ToList(),
                Classes = blockClass,
                Html = renderedContent,
                ShouldCompile = block.ViewModel.ShouldCompile
            };
            return angularBlock;
        }

        protected AngularBlock RenderWysiwygBlock(WysiwygBlock block, HtmlHelper html)
        {
            string webBlocksId = WebBlocksUtility.IsInBuilder ? string.Format(" wbid='{0}'", block.Id) : "";

            string blockClass = string.Format("pageWysiwygBlock{0}{1}", block.ViewModel.Classes.Length > 0 ? " " : "", block.ViewModel.Classes);

            blockClass = WebBlocksUtility.IsInBuilder ? "block " + blockClass : blockClass;

            string blockTemplateAttribute = WebBlocksUtility.IsInBuilder ? string.Format(" templateblock='{0}'", block.IsTemplateBlock.ToString().ToLower()) : "";
            string blockDeletedAttribute = WebBlocksUtility.IsInBuilder && block.IsDeletedBlock ? " deletedBlock='deleted' style='display:none;visibilty:hidden;'" : "";

            TinyMCE tinyMceHelper = new TinyMCE();

            string blockContent = WebBlocksUtility.IsInBuilder ? block.Content : umbraco.library.RenderMacroContent(tinyMceHelper.ReplaceMacroTags(HttpUtility.UrlDecode(block.Content)), WebBlocksUtility.CurrentPageNodeId);

            if (!WebBlocksUtility.IsInBuilder)
                blockContent = LocalLinkHelper.ResolveLocalLinks(blockContent);

            blockContent = blockContent == "" || blockContent == "<p></p>" ? "<p>&nbsp;</p>" : blockContent;

            //add a node block to the angularjs containers model
            var containersBuilder = AngularContainersBuilder.Load();
            var angularBlock = new WysiwygBlock();
            angularBlock.Id = block.Id;
            angularBlock.Name = "Wysiwyg";
            angularBlock.Content = blockContent;
            angularBlock.SortOrder = block.SortOrder;
            angularBlock.IsDeletedBlock = block.IsDeletedBlock;
            angularBlock.IsTemplateBlock = block.IsTemplateBlock;
            angularBlock.TemplateContainer = block.TemplateContainer;
            angularBlock.ViewModel = new AngularBlockViewModel() 
            {
                Tag = block.ViewModel.Tag,
                Attributes = new List<IBlockElementAttribute>(),
                Classes = blockClass,
                Html = blockContent
            };

            return angularBlock; // not returning content, we will just register a block to the container and will contain the rendered code
        }

        protected IRenderingEngine ResolveRenderingEngine(ContentBlock block)
        {
            IRenderingEngine engine;

            if (BlockControllerCache.Controllers.Contains(block.Content.DocumentTypeAlias))
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
    }
}
