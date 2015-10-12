using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using Umbraco.Core;
using WebBlocks.Controllers;

namespace WebBlocks
{
    public class StartUp : ApplicationEventHandler
    {
        protected override void ApplicationStarting(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            base.ApplicationStarting(umbracoApplication, applicationContext);

            foreach(var asm in AppDomain.CurrentDomain.GetAssemblies())
            {
                BlockControllerCache.Controllers.AddRange(asm.GetTypes()
                    .Where(type => typeof(Umbraco.Web.Mvc.SurfaceController).IsAssignableFrom(type))
                    .Select(x => x.Name.TrimEnd("Controller")));
            }
        }
    }
}