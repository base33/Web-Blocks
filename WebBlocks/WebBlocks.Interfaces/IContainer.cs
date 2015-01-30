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
        /// The container element tag
        /// </summary>
        string Tag { get; set; }

        /// <summary>
        /// The container classes attribute value
        /// </summary>
        string Classes { get; set; }

        /// <summary>
        /// All additional attributes the container html element should be given
        /// </summary>
        Dictionary<string, string> Attributes { get; set; }
        //TODO: RENDER ATTRIBUTES in builder

        /// <summary>
        /// The class to give to all wysiwygs that have been added (e.g. col-md-3 or grid_3)
        /// </summary>
        string WysiwygClass { get; set; }

        /// <summary>
        /// The wysiwyg element tag (div or span etc.)
        /// </summary>
        string WysiwygTag { get; set; }

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
