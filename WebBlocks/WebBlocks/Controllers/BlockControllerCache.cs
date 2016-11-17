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
                try
                {
                    Controllers.AddRange(asm.GetTypes()
                        .Where(type => typeof(Umbraco.Web.Mvc.SurfaceController).IsAssignableFrom(type))
                        .Select(x => x.Name.TrimEnd("Controller")));
                }
                catch
                {
                    Umbraco.Core.Logging.Logger.CreateWithDefaultLog4NetConfiguration().Info(
                        System.Reflection.MethodBase.GetCurrentMethod().DeclaringType, "BlockControllerCache.BuildCache() : Error adding controllers from assemblies");
                }
            }
        }
    }
}