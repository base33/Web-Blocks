using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WebBlocks.Interfaces;

namespace WebBlocks.Models.Angular
{
    public class AngularElementAttribute : IBlockElementAttribute
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }
}
