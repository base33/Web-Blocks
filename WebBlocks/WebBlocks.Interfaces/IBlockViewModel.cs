using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebBlocks.Interfaces
{
    public interface IBlockViewModel
    {
        string Tag { get; set; }
        string Classes { get; set; }
        string Html { get; set; }
        bool ShouldRerender { get; set; }
        bool ShouldCompile { get; set; }
        List<IBlockElementAttribute> Attributes { get; set; }
    }
}
