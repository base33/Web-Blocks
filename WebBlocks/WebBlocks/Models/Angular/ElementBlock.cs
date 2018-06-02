using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Interfaces;

namespace WebBlocks.Models.Angular
{
    public class ElementBlock : AngularBlock
    {
        public string Class { get; set; }
        public List<IBlock> Children { get; set; } = new List<IBlock>();

        public ElementBlock()
        {
            __type = "ElementBlock";
            
        }
    }
}