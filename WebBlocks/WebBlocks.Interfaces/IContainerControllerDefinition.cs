using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebBlocks.Interfaces
{
    public interface IContainerControllerDefinition
    {
        Type Type { get; set; }
    }
}
