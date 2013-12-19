using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Interfaces;

namespace WebBlocks.Model
{
    public class WysiwygBlock : Block
    {
        public string Content;
        public string Element = "div";
    }
}