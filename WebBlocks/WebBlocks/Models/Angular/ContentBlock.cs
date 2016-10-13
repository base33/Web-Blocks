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
        public string Guid { get; set; }

        public IPublishedContent Content 
        { 
            get
            {
                if (content == null && !string.IsNullOrEmpty(Guid))
                {
                    content = PublishedContentProvider.Load(Guid);
                }
                
                if(content == null)
                {
                    content = PublishedContentProvider.Load(Id);
                }

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

        public ContentBlock(string guid) : this()
        {
            Guid = guid;
        }
    }
}