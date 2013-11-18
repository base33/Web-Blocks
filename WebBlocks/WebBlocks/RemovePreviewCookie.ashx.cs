using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using umbraco.BusinessLogic;

namespace WebBlocks
{
    /// <summary>
    /// Summary description for RemovePreviewCookie
    /// </summary>
    public class RemovePreviewCookie : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            if (User.GetCurrent() == null) return;
            HttpCookie cookie = context.Response.Cookies["UMB_PREVIEW"];
            cookie.Expires = DateTime.Now.AddDays(-30);
            context.Response.ContentType = "text/plain";
            context.Response.Write("Done");
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}