using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Interfaces;

namespace WebBlocks.Models.Angular
{
    public class AngularRecycleBinBlock
    {
        public IBlock Block { get; set; }
        public string Message { get; set; }
    }
}