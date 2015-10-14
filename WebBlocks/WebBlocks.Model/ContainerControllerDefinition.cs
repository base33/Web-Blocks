using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Interfaces;

namespace WebBlocks.Model
{
    public class ContainerControllerDefinition : IContainerControllerDefinition
    {
        public Type Type { get; set; }
        
        public ContainerControllerDefinition(Type type)
        {
            Type = type;
        }
    }
}