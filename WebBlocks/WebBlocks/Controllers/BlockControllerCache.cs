using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core;

namespace WebBlocks.Controllers
{
    public static class BlockControllerCache
    {
        public static List<string> Controllers { get; set; }

        static BlockControllerCache()
        {
            Controllers = new List<string>();
        }

        internal static void BuildCache()
        {
            foreach(var asm in AppDomain.CurrentDomain.GetAssemblies())
            {
                Controllers.AddRange(asm.GetTypes()
                    .Where(type => typeof(Umbraco.Web.Mvc.SurfaceController).IsAssignableFrom(type))
                    .Select(x => x.Name.TrimEnd("Controller")));
            }
        }
    }
}