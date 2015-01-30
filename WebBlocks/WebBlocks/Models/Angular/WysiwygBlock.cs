using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebBlocks.Models.Angular
{
    public class WysiwygBlock : AngularBlock
    {
        public string Content = "";

        public WysiwygBlock()
        {
            __type = "WysiwygBlock";
        }

        public WysiwygBlock(int id) : this()
        {
            Id = id;
        }
    }
}