using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebBlocks.Models.Angular
{
    public class AngularBlockHistory
    {
        public string LastContainer { get; set; }

        public AngularBlockHistory()
        {
            LastContainer = "";
        }
    }
}