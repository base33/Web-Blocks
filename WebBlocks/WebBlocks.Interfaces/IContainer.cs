using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebBlocks.Interfaces
{
    public interface IContainer
    {
        /// <summary>
        /// The name of the container (this must be unique)
        /// </summary>
        string Name { get; set; }

        /// <summary>
        /// The list of blocks in the container that should be rendered
        /// </summary>
        List<IBlock> Blocks { get; set; }

        /// <summary>
        /// The html element this container should be rendered as
        /// </summary>
        string Element { get; set; }

        /// <summary>
        /// The css classes the container html element should be given
        /// </summary>
        string CssClass { get; set; }

        /// <summary>
        /// All additional attributes the container html element should be given
        /// </summary>
        Dictionary<string, string> Attributes { get; set; }

        /// <summary>
        /// The class to give to all dynamic wysiwygs that have been added via the Web Blocks builder
        /// </summary>
        string DynamicWysiwygClass { get; set; }

        /// <summary>
        /// Specifies what blocks are allowed or excluded
        /// Types: AllowedBlocks or ExcludedBlocks (found in WebBlocks.Model)
        /// </summary>
        IContainerPermissions ContainerPermissions { get; set; }

        /// <summary>
        /// Override the container rendering when the container is being ran outside of the Web Blocks builder
        /// </summary>
        IContainerRenderer ContainerRenderer { get; set; }
    }
}
