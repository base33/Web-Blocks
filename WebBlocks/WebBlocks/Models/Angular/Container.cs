using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Interfaces;

namespace WebBlocks.Models.Angular
{
    public class Container : IContainer
    {
        public string Name { get; set; }
        public string Tag { get; set; }
        public string Classes { get; set; }
        public string WysiwygTag { get; set; }
        public string WysiwygClass { get; set; }
        public List<IBlock> Blocks { get; set; }
        public Dictionary<string, string> Attributes { get; set; }
        public IContainerPermissions ContainerPermissions { get; set; }
        public IContainerRenderer ContainerRenderer { get; set; }

        public Container()
        {
            Name = "";
            Tag = "div";
            Classes = "";
            WysiwygTag = "div";
            WysiwygClass = "";
            Blocks = new List<IBlock>();
            Attributes = new Dictionary<string, string>();
            ContainerPermissions = null;
            ContainerRenderer = null;
        }
    }
}