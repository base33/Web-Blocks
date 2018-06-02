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
        /// <summary>
        /// Wysiwygs are enabled by default
        /// </summary>
        public bool WysiwygsAllowed { get; set; }
        public string WysiwygTag { get; set; }
        public string WysiwygClass { get; set; }
        public List<IBlock> Blocks { get; set; }
        public Dictionary<string, string> Attributes { get; set; }
        public IContainerPermissions ContainerPermissions { get; set; }
        public IContainerControllerDefinition ContainerController { get; set; }
        public IEnumerable<GridDefinition> GridDefinitions { get; set; }

        public Container()
        {
            Name = "";
            Tag = "div";
            Classes = "";
            WysiwygsAllowed = true;
            WysiwygTag = "div";
            WysiwygClass = "";
            Blocks = new List<IBlock>();
            Attributes = new Dictionary<string, string>();
            ContainerPermissions = null;
            ContainerController = null;
            GridDefinitions = new List<GridDefinition>();
        }
    }

    public class GridDefinition
    {
        public string Alias { get; set; }
        public string ClassName { get; set; }
        /// <summary>
        /// Whether to allow this directly within a container
        /// </summary>
        public bool AllowAtRoot { get; set; }
        /// <summary>
        /// What grid rows can be added within this element?
        /// </summary>
        public string[] AllowedChildGrids { get; set; }
        /// <summary>
        /// Whether Content/Wysiwyg blocks can be added
        /// </summary>
        public bool AllowNonElementBlocks { get; set; }
        /// <summary>
        /// Whether to add to the accepting element by default if there are no other options
        /// </summary>
        public bool AddByDefaultIfOnlyOption { get; set; }

        public IEnumerable<GridDefinition> GridDefinitions { get; set; } = new List<GridDefinition>();
    }
}