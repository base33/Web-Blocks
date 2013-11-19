using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using Umbraco.Web;
using Umbraco.Web.Models;
using WebBlocks.Views;
using WebBlocks.Interfaces;
using WebBlocks.Model;
using WebBlocks.Utilities.Umbraco;
using WebBlocks.Utilities.WebBlocks;
using WebBlocks.Providers;

namespace WebBlocks.Extensions
{
    public static class HtmlContainerExtension
    {
        /// <summary>
        /// Initialises Web Blocks with the current page
        /// </summary>
        public static void InitWebBlocks()
        {
            if (WebBlocksUtility.CurrentPageContent == null)
            {
                WebBlocksUtility.CurrentPageNodeId = UmbracoContext.Current.PageId ?? 0;
                WebBlocksUtility.CurrentPageContent = PublishedContentProvider.Load(UmbracoContext.Current.PageId ?? 0);
            }
        }

        public static string Container(this HtmlHelper<RenderModel> html, IContainer container)
        {
            InitWebBlocks();

            LoadContainerBlocks(container.Name, container.Blocks, container.DynamicWysiwygClass);

            container.Blocks = container.Blocks.OrderBy(b => b.SortOrder).ToList();

            //if the container is being rendered for the builder or a container renderer has not been specified
            if (WebBlocksUtility.IsInBuilder || (!WebBlocksUtility.IsInBuilder && container.ContainerRenderer == null))
            {
                RenderStandardContainer(container, html);
            }
            else
            {
                container.ContainerRenderer.Render(container, html);
            }

            
            
            return "";
        }

        private static void RenderStandardContainer(IContainer container, HtmlHelper<RenderModel> html)
        {
            string renderedBlocks = "";
            string containerPermissionAttr = WebBlocksUtility.IsInBuilder ? BuildContainerPermissionsAttr(container.ContainerPermissions) : "";

            BlockView blockView = new BlockView();
            foreach (Block block in container.Blocks)
            {
                renderedBlocks += blockView.Render(block, html);
            }

            html.ViewContext.Writer.Write("<{0}{1}{2}{3}{4}{5}>",
                                          container.Element,
                                          container.CssClass != "" ? string.Format(" class=\"container {0}\"", container.CssClass) : "",
                                          WebBlocksUtility.IsInBuilder ? string.Format(" wbid='{0}'", container.Name) : "",
                                          containerPermissionAttr,
                                          !string.IsNullOrEmpty(container.DynamicWysiwygClass) && WebBlocksUtility.IsInBuilder ?
                                                string.Format(" dynamicWysiwygClass='{0}'", container.DynamicWysiwygClass) : "",
                                          BuildHtmlAttrString(container.Attributes));

            html.ViewContext.Writer.Write(renderedBlocks);

            html.ViewContext.Writer.Write("</{0}>", container.Element);
        }

        /// <summary>
        /// Loads the current state of the container stored on the page and synchronises what blocks
        /// are default on the template and those that have been dragged on.
        /// </summary>
        /// <param name="containerName">The name of the container to load the blocks into</param>
        /// <param name="blocks">The default template blocks</param>
        /// <param name="dynamicWysiwygClass">The class that should be added to any dynamically added wysiwyg blocks</param>
        private static void LoadContainerBlocks(string containerName, List<IBlock> blocks, string dynamicWysiwygClass)
        {
            //set IsTemplateBlock to true for all blocks
            blocks.ForEach(b => b.IsTemplateBlock = true);

            //load the current container saved state
            ContainerProvider containerProvider = new ContainerProvider();
            Container container = containerProvider.ContainerByName(containerName);

            if (container == null) return;

            //sync template blocks with what is saved on the page
            foreach (IBlock templateBlock in blocks)
            {
                //get the saved state of the current block
                IBlock savedBlock = container.Blocks.FirstOrDefault(b => b.IsTemplateBlock && b.Id == templateBlock.Id);
                if (savedBlock == null) continue;

                templateBlock.IsDeleted = savedBlock.IsDeleted;
                templateBlock.SortOrder = savedBlock.SortOrder;

                //if its a wysiwyg block then add transfer the content
                if(templateBlock is WysiwygBlock)
                    ((WysiwygBlock)templateBlock).Content = ((WysiwygBlock)savedBlock).Content;
            }

            //add all dragged-on blocks to the blocks
            foreach (IBlock pageBlock in container.Blocks.Where(b => (!b.IsTemplateBlock) || (b.IsTemplateBlock && b is WysiwygBlock && !blocks.Exists(tb => tb.Id == b.Id))))
            {
                //if this is a dynamically added wysiwyg block then set the default class
                pageBlock.Class = pageBlock.IsTemplateBlock && pageBlock is WysiwygBlock ? dynamicWysiwygClass : pageBlock.Class;
                blocks.Add(pageBlock);
            }

            //if were not in the builder remove all template blocks that have been deleted
            if (!WebBlocksUtility.IsInBuilder)
                blocks.RemoveAll(b => b.IsDeleted == true);

            //remove any blocks that have been deleted from Umbraco
            blocks.RemoveAll(b => b is NodeBlock && ((NodeBlock)b).Content == null);
        }

        /// <summary>
        /// Builds the container permissions attribute to add to the container for web blocks to interpret 
        /// what blocks can be rendered.
        /// Can either be:
        /// allowedBlocks="blockType1,blockType2" or excludedBlocks="blockType1,blockType2" or nothing.
        /// </summary>
        /// <param name="containerPermissions"></param>
        /// <returns>an attribute to add to the container</returns>
        private static string BuildContainerPermissionsAttr(IContainerPermissions containerPermissions)
        {
            string containerPermissionsAttr = "";
            //if AllowedBlocks type was passed in
            if (containerPermissions != null && containerPermissions is AllowedBlocks)
                containerPermissionsAttr = string.Format(" allowedBlocks=\"{0}\"", String.Join(",", containerPermissions.AsStringArray()));
            //if ExcludedBlocks type was passed in
            else if (containerPermissions != null && containerPermissions is ExcludedBlocks)
                containerPermissionsAttr = string.Format(" excludedBlocks=\"{0}\"", String.Join(",", containerPermissions.AsStringArray()));
            return containerPermissionsAttr;
        }

        /// <summary>
        /// Builds a dictionary into a string of html attributes ready to add to the container
        /// End result: 'attribute1="value" attribute2="value"'
        /// </summary>
        /// <param name="attributes"></param>
        /// <returns>all attributes concatinated into one string</returns>
        private static string BuildHtmlAttrString(Dictionary<string, string> attributes)
        {
            if (attributes == null || !attributes.Any()) return "";

            return attributes.Keys.Aggregate("", (current, key) => current + string.Format(" {0}=\"{1}\"", key, attributes[key]));
        }
    }
}