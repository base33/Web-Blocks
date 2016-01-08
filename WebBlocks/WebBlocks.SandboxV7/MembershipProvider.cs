using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using Umbraco.Web.Security.Providers;

namespace WebBlocks.SandboxV7
{
    public class MembershipProvider : MembersMembershipProvider
    {
        protected static string AUTHCOOKIE = "yourAuthCookie";

        public override MembershipUser GetUser(string username, bool userIsOnline)
        {
            HttpCookie authCookie = HttpContext.Current.Request.Cookies[AUTHCOOKIE];

            if (authCookie != null)
            {
                FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(authCookie.Value);
                username = ticket.Name;
            }

            
            var member = base.GetUser(username, userIsOnline);

            return member;
        }
    }
}