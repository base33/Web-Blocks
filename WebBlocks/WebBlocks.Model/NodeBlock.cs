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
                    content = PublishedContentProvider.Load(id);
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