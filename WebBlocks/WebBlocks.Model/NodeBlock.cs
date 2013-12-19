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
    public class NodeBlock : Block
    {
        protected DynamicPublishedContent content = null;

        public dynamic Content
        {
            get
            {
                content = PublishedContentProvider.Load(id);
                return content != null ? content.AsDynamic() : null;
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