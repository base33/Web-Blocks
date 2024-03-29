﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using System.Web.UI;
using Umbraco.Web;
using Umbraco.Web.Models;
using Umbraco.Web.Security;
using WebBlocks.Views;
using WebBlocks.Interfaces;
using WebBlocks.Utilities.Umbraco;
using WebBlocks.Utilities.WebBlocks;
using WebBlocks.Providers;
using WebBlocks.Models.Angular;

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
                WebBlocksUtility.CurrentPageContent = PublishedContentProvider.Load(UmbracoContext.Current.PageId ?? 0); //(new UmbracoHelper(UmbracoContext.Current)).TypedContent(UmbracoContext.Current.PageId);
            }
        }

        public static string Container<T>(this HtmlHelper<T> html, string propertyAlias, IContainer container)
        {
            InitWebBlocks();

            if (WebBlocksUtility.IsInBuilder && HttpContext.Current.Request["username"] != null 
                && !string.IsNullOrWhiteSpace(HttpContext.Current.Request["username"]) && !(new MembershipHelper(UmbracoContext.Current).IsLoggedIn()))
            {
                FormsAuthentication.SetAuthCookie(HttpContext.Current.Request["username"], true);
                HttpContext.Current.Response.Redirect(HttpContext.Current.Request.RawUrl + "&mustLogOut=true");
            }


            LoadContainerBlocks(propertyAlias, container.Name, container.Blocks, container.WysiwygTag, container.WysiwygClass);

            container.Blocks = container.Blocks.OrderBy(b => b.SortOrder).ToList();

            WebBlocksUtility.CurrentContainer = container;

            //if the container is being rendered for the builder or a container renderer has not been specified
            if(WebBlocksUtility.IsInBuilder)
            {
                RenderAngularJsContainer(container, html);
            }
            else if (container.ContainerController == null)
            {
                RenderStandardContainer(container, html);
            }
            else
            {
                RenderContainerController(container, html);
            }
            return "";
        }

        private static void RenderContainerController(IContainer container, HtmlHelper html)
        {
            WebBlocksUtility.CurrentBlocksContent = container.Blocks.Where(b => b is ContentBlock).Select(b => ((ContentBlock)b).Content).Where(b => b != null).ToList();
            html.ViewContext.Writer.Write(html.Action("Render", container.ContainerController.Type));
        }

        /// <summary>
        /// Renders the angular js container (angular-ready), and builds container model for angular
        /// </summary>
        /// <param name="container"></param>
        /// <param name="html"></param>
        private static void RenderAngularJsContainer(IContainer container, HtmlHelper html)
        {
            //create angularjs container
            var containersBuilder = AngularContainersBuilder.Load();
            containersBuilder.AddContainer(
                new Container()
                {
                    Name = container.Name,
                    WysiwygsAllowed = container.WysiwygsAllowed,
                    WysiwygClass = container.WysiwygClass,
                    Blocks = new List<IBlock>(),
                    ContainerPermissions = container.ContainerPermissions,
                    Attributes = container.Attributes
                });



            string renderedBlocks = "";
            AngularBlockView blockView = new AngularBlockView();
            foreach (IBlock block in container.Blocks)
            {
                string renderedBlock = blockView.Render(block, html);
                renderedBlocks += renderedBlock ?? "";
            }

            html.ViewContext.Writer.Write("<{0}{1}{2} ui-sortable='getSortableOptions(layoutBuilderModel.Containers.{3}.Blocks)' ng-model='layoutBuilderModel.Containers.{3}.Blocks' wb-container-model='layoutBuilderModel.Containers.{3}' ng-drop='true' ng-drop-success='handleBlockDropped($data, $event, $container)'>",
                                          container.Tag,
                                          container.Classes != "" ? string.Format(" class=\"{0} wbcontainer\"", container.Classes) : "",
                                          BuildHtmlAttrString(container.Attributes),
                                          container.Name);

            html.ViewContext.Writer.Write(@"<div wb-block
                                 ng-hide='block.IsDeletedBlock' 
                                 wb-on-double-click='editBlock'
                                 wb-on-double-tap='editBlock'
                                 wb-on-right-click='showEditBlockDialog'
                                 wb-on-touch-hold='showEditBlockDialog'
                                 wb-container-model='layoutBuilderModel.Containers.{0}'
                                 ng-model='block'
                                 ng-repeat='block in layoutBuilderModel.Containers.{0}.Blocks'>
                            </div>", container.Name);

            html.ViewContext.Writer.Write("</{0}>", container.Tag);
        }

        private static void RenderStandardContainer(IContainer container, HtmlHelper html)
        {
            string renderedBlocks = "";
            string containerPermissionAttr = WebBlocksUtility.IsInBuilder ? BuildContainerPermissionsAttr(container.ContainerPermissions) : "";

            BlockView blockView = new BlockView();
            foreach (IBlock block in container.Blocks)
            {
                string renderedBlock = blockView.Render(block, html);
                renderedBlocks += renderedBlock ?? "";
            }

            html.ViewContext.Writer.Write("<{0}{1}{2}{3}{4}{5}>",
                                          container.Tag,
                                          container.Classes != "" ? string.Format(" class=\"{0}\"", container.Classes) : "",
                                          WebBlocksUtility.IsInBuilder ? string.Format(" wbid='{0}'", container.Name) : "",
                                          containerPermissionAttr,
                                          !string.IsNullOrEmpty(container.WysiwygClass) && WebBlocksUtility.IsInBuilder ?
                                                string.Format(" dynamicWysiwygClass='{0}'", container.WysiwygClass) : "",
                                          BuildHtmlAttrString(container.Attributes));

            html.ViewContext.Writer.Write(renderedBlocks);

            html.ViewContext.Writer.Write("</{0}>", container.Tag);
        }

        /// <summary>
        /// Loads the current state of the container stored on the page and synchronises what blocks
        /// are default on the template and those that have been dragged on.
        /// </summary>
        /// <param name="containerName">The name of the container to load the blocks into</param>
        /// <param name="templateBlocks">The default template blocks</param>
        /// <param name="dynamicWysiwygClass">The class that should be added to any dynamically added wysiwyg blocks</param>
        private static void LoadContainerBlocks(string propertyAlias, string containerName, List<IBlock> templateBlocks, string dynamicWysiwygTag, string dynamicWysiwygClass)
        {
            //set IsTemplateBlock to true for all blocks
            templateBlocks.ForEach(b => {
                b.IsTemplateBlock = true;
                b.TemplateContainer = containerName;
            });

            //load the current container saved state
            string webBlocksData = WebBlocksUtility.CurrentPageContent.GetPropertyValue<string>(propertyAlias);
            LayoutBuilderProvider containerProvider = new LayoutBuilderProvider(webBlocksData);
            IContainer container = containerProvider.ContainerByName(containerName);

            if (container == null) return;

            //will hold any template blocks that do not match any saved blocks in the container.
            //we will check if they exist in other containers.  If they are, we will remove the template block from the array
            //this is to support moving blocks between containers
            List<IBlock> missingBlocks = new List<IBlock>();

            //sync template blocks with what is saved on the page
            foreach (IBlock templateBlock in templateBlocks)
            {
                //get the saved state of the current block
                IBlock savedBlock = container.Blocks.FirstOrDefault(b => b.IsTemplateBlock && b.Id == templateBlock.Id && b.TemplateContainer == containerName);
                if (savedBlock == null)
                {
                    //check if the block has been moved
                    missingBlocks.Add(templateBlock);
                    continue;
                }

                templateBlock.IsDeletedBlock = savedBlock.IsDeletedBlock;
                templateBlock.IsTemplateBlock = true;
                templateBlock.SortOrder = savedBlock.SortOrder;

                //if its a wysiwyg block then add transfer the content
                if (templateBlock is WysiwygBlock)
                {
                    ((WysiwygBlock)templateBlock).Content = ((WysiwygBlock)savedBlock).Content;
                    templateBlock.ViewModel.Classes = dynamicWysiwygClass;
                    templateBlock.ViewModel.Tag = dynamicWysiwygTag;
                }
            }

            //add all dragged-on blocks to the blocks                 not a template block     is a template block from another container                    is a template wysiwyg block that does not longer exist on the template (we should keep it)
            foreach (IBlock pageBlock in container.Blocks.Where(b => (!b.IsTemplateBlock) || (b.IsTemplateBlock && b.TemplateContainer != containerName) || (b.IsTemplateBlock && b is WysiwygBlock && !templateBlocks.Exists(tb => tb.Id == b.Id))))
            {
                if (pageBlock is WysiwygBlock)
                {
                    pageBlock.ViewModel.Classes = dynamicWysiwygClass;
                    pageBlock.ViewModel.Tag = dynamicWysiwygTag;
                }
                templateBlocks.Add(pageBlock);
            }

            //lets find all the missing templates in other containers.
            //if we find it, we will remove it from the container
            foreach (IBlock missingBlock in missingBlocks)
            {
                bool found = false;
                foreach(string otherContainerName in containerProvider.LayoutBuilder.Containers.Keys)
                {
                    IContainer otherContainer = containerProvider.ContainerByName(otherContainerName);
                    //if the block is the same id, is also a template block and it was originally from the current container name
                    if (otherContainer.Blocks.Exists(b => b.Id == missingBlock.Id && b.IsTemplateBlock && b.TemplateContainer == containerName))
                    {
                        //remove it from the blocks to be rendered in the container
                        templateBlocks.Remove(missingBlock);
                        found = true;
                        break;
                    }
                }
                if(!found && containerProvider.LayoutBuilder.BlockStorage.Exists(b => b.Block.Id == missingBlock.Id && b.Block.IsTemplateBlock && b.Block.TemplateContainer == containerName))
                    templateBlocks.Remove(missingBlock);
                
            }

            //if were not in the builder remove all template blocks that have been deleted
            if (!WebBlocksUtility.IsInBuilder)
                templateBlocks.RemoveAll(b => b.IsDeletedBlock == true);



            //remove any blocks that have been deleted from Umbraco
            templateBlocks.RemoveAll(b => b is ContentBlock && ((ContentBlock)b).Content == null);
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
            if (containerPermissions != null && containerPermissions is WebBlocks.Model.AllowedBlocks)
                containerPermissionsAttr = string.Format(" allowedBlocks=\"{0}\"", String.Join(",", containerPermissions.AsStringArray()));
            //if ExcludedBlocks type was passed in
            else if (containerPermissions != null && containerPermissions is WebBlocks.Model.ExcludedBlocks)
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