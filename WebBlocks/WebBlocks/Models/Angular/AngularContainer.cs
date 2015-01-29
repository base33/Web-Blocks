using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebBlocks.Models.Angular
{
    public class AngularContainer
    {
        public string Name = "";
        public string WysiwygClass = "";
        public List<AngularBlock> Blocks = new List<AngularBlock>();
    }
}