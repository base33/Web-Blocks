using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core;
using Umbraco.Core.Models.Membership;
using Umbraco.Core.Security;

namespace WebBlocks.Helpers
{
	/// <summary>
	/// A helper class for Umbraco 7+ to get the currently logged on back office user from a non-backoffice context.
	/// </summary>
	public static class BackofficeUserHelper
	{
        /// <summary>
        /// Determines if there is currently a back office user logged on.
        /// </summary>
        public static bool IsUserAuthenticated
        {
            get
            {
                var http = new HttpContextWrapper(HttpContext.Current);
                var ticket = http.GetUmbracoAuthTicket();
                return http.AuthenticateCurrentRequest(ticket, false);
            }
        }
    }
}