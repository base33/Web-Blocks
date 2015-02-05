using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WebBlocks.Interfaces;

namespace WebBlocks.Models.Angular
{
    public class AngularBlockStorageBlock
    {
        public IBlock Block { get; set; }
        public string Message { get; set; }
        public AngularBlockHistory BlockHistory { get; set; }
    }
}
