using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Interfaces;

namespace WebBlocks.Model
{
    public class Container : IContainer
    {
        protected string name;
        protected List<IBlock> blocks;
        protected string element;
        protected string cssClass;
        protected Dictionary<string, string> attributes;
        protected string dynamicWysiwygClass;
        protected IContainerPermissions containerPermissions;
        protected IContainerRenderer containerRenderer;

        /// <summary>
        /// The name of the container (this must be unique)
        /// </summary>
        public string Name { get { return name; } set { name = value; } }

        /// <summary>
        /// The list of blocks in the container that should be rendered
        /// </summary>
        public List<IBlock> Blocks { get { return blocks; } set { blocks = value; } }

        /// <summary>
        /// The html element this container should be rendered as
        /// </summary>
        public string Element { get { return element; } set { element = value; } }

        /// <summary>
        /// The css classes the container html element should be given
        /// </summary>
        public string CssClass { get { return cssClass; } set { cssClass = value; } }

        /// <summary>
        /// All additional attributes the container html element should be given
        /// </summary>
        public Dictionary<string, string> Attributes { get { return attributes; } set { attributes = value; } }

        /// <summary>
        /// The class to give to all dynamic wysiwygs that have been added via the Web Blocks builder
        /// </summary>
        public string DynamicWysiwygClass { get { return dynamicWysiwygClass; } set { dynamicWysiwygClass = value; } }

        /// <summary>
        /// Specifies what blocks are allowed or excluded
        /// Types: AllowedBlocks or ExcludedBlocks (found in WebBlocks.Model)
        /// </summary>
        public IContainerPermissions ContainerPermissions { get { return containerPermissions; } set { containerPermissions = value; } }

        /// <summary>
        /// Override the container rendering when the container is being ran outside of the Web Blocks builder
        /// </summary>
        public IContainerRenderer ContainerRenderer { get { return containerRenderer; } set { containerRenderer = value; } }

        public Container()
        {
            Element = "div";
            Blocks = new List<IBlock>();
            Attributes = new Dictionary<string, string>();
            ContainerPermissions = null;
            ContainerRenderer = null;
        }
    }
}