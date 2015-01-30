using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebBlocks.Interfaces
{
    public interface IBlockElementAttribute
    {
        string Name { get; set; }
        string Value { get; set; }
    }
}
