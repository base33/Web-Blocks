using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using Umbraco.Web;

namespace WebBlocks
{
    /// <summary>
    /// Summary description for WebBlocksProtectedPage
    /// </summary>
    public class WebBlocksProtectedPage : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string command = context.Request["command"] ?? "signout";

            if(command == "signin")
            {
                string username = context.Request["username"] ?? "";
                string password = context.Request["password"] ?? "";
                if (!umbraco.library.IsLoggedOn() && Membership.ValidateUser(username, password))
                {
                    FormsAuthentication.SetAuthCookie(username, true);
                }
            }
            else if(command == "signout")
            {
                FormsAuthentication.SignOut();
            }
            
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