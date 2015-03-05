using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core.Models;
using WebBlocks.Utilities.Umbraco;

namespace WebBlocks.Models.Angular
{
    public class ContentBlock : AngularBlock
    {
        protected IPublishedContent content = null;

        public string ContentTypeAlias { get; set; }

        public IPublishedContent Content 
        { 
            get
            {
                if(content == null) 
                    content = (IPublishedContent)PublishedContentProvider.Load(Id);
                return content;
            }
        }

        public ContentBlock()
        {
            __type = "NodeBlock";
            ContentTypeAlias = "";
        }

        public ContentBlock(int id) : this()
        {
            Id = id;
        }
    }
}