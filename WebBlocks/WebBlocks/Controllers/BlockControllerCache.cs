using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebBlocks.Controllers
{
    public static class BlockControllerCache
    {
        public static List<string> Controllers { get; set; }

        static BlockControllerCache()
        {
            Controllers = new List<string>();
        }
    }
}