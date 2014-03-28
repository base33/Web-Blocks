using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using Umbraco.Core;
using Umbraco.Web;

namespace WebBlocks.Utilities.Umbraco
{
    public class ContextHelper
    {
        public static IDisposable EnsureHttpContext()
        {
            return new HttpContextEnsurer();
        }

        class HttpContextEnsurer : IDisposable
        {
            private readonly bool _fake;
            public HttpContextEnsurer()
            {
                _fake = HttpContext.Current == null;
                if (_fake)
                {
                    HttpContext.Current = new HttpContext(new HttpRequest("", "http://tempuri.org", ""), new HttpResponse(new StringWriter()));
                }
                if (UmbracoContext.Current == null)
                {
                    /* v6.1.4+ (I think) */
                    UmbracoContext.EnsureContext(new HttpContextWrapper(HttpContext.Current), ApplicationContext.Current, true);
                    /* v6.1.3- (I think) */
                    /*typeof(UmbracoContext)
                    .GetMethods(BindingFlags.Static | BindingFlags.NonPublic)
                    .First(x => x.GetParameters().Count() == 3)
                    .Invoke(null, new object[] { new HttpContextWrapper(HttpContext.Current), ApplicationContext.Current, true });*/
                }
            }

            public void Dispose()
            {
                if (_fake)
                {
                    HttpContext.Current = null;
                }
            }
        }
    }
}