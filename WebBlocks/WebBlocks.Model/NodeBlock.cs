using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Web;
using Umbraco.Web.Models;
using WebBlocks.Interfaces;
using WebBlocks.Utilities.Umbraco;
using WebBlocks.Utilities.WebBlocks;

namespace WebBlocks.Model
{
    public class NodeBlock : Block, IBlock
    {
        protected DynamicPublishedContent content = null;

        public dynamic Content
        {
            get
            {
                if (content == null)
                {
                    var temp = WebBlocksUtility.IsInBuilder ? new DynamicContent(UmbracoContext.Current.Application.Services.ContentService.GetById(Id)) :
                        new UmbracoHelper(UmbracoContext.Current).TypedContent(Id);
                    if(temp != null)
                        content = new DynamicPublishedContent(temp);

                    if (WebBlocksUtility.IsInBuilder || UmbracoContext.Current.InPreviewMode)
                    {
                        content = new DynamicPublishedContent(new DynamicContent(Id)).AsDynamic();
                    }
                    else
                    {
                        content = new DynamicPublishedContent((new UmbracoHelper(UmbracoContext.Current)).TypedContent(Id)).AsDynamic();
                    }
                }
                return content;
            }
        }

        public NodeBlock()
        {
        }

        public NodeBlock(int nodeId)
        {
            Id = nodeId;
        }
    }
}