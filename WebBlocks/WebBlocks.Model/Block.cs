using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using umbraco.NodeFactory;
using WebBlocks.Interfaces;

namespace WebBlocks.Model
{
    public class Block : IBlock
    {
        protected int id;
        protected string classes;
        protected Dictionary<string, string> attributes;
        protected bool isTemplateBlock;
        protected bool isDeleted;
        protected int sortOrder;
        protected string type;

        public int Id { get { return id; } set { id = value; } }
        public string Class { get { return classes; } set { classes = value; } }
        public Dictionary<string, string> Attributes { get { return attributes; } set { attributes = value; } }
        public bool IsTemplateBlock { get { return isTemplateBlock; } set { isTemplateBlock = value; } }
        public bool IsDeleted { get { return isDeleted; } set { isDeleted = value; } }
        public int SortOrder { get { return sortOrder; } set { sortOrder = value; } }
        public string __type { get { return type; } set { type = value; } }

        public Block()
        {
            Id = 0;
            Class = "";
            Attributes = new Dictionary<string, string>();
            IsTemplateBlock = false;
            IsDeleted = false;
        }
    }
}