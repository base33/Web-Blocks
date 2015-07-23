using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core;
using Umbraco.Core.Models.Membership;
using Umbraco.Core.Security;

namespace WebBlocks.Helpers
{
	public static class BackofficeUserHelper
	{
		const string BackofficeIdentityKey = "UmbracoBackofficeIdentity";

		public static UmbracoBackOfficeIdentity CurrentIdentity
		{
			get
			{
				if (!HttpContext.Current.Items.Contains(BackofficeIdentityKey))
					HttpContext.Current.Items[BackofficeIdentityKey] = new HttpContextWrapper(HttpContext.Current).GetCurrentIdentity(true);

				return (UmbracoBackOfficeIdentity)HttpContext.Current.Items[BackofficeIdentityKey];
			}
		}

		public static bool IsUserAuthenticated
		{
			get
			{
				return CurrentIdentity.IsAuthenticated;
			}
		}

		public static umbraco.BusinessLogic.User GetCurrentUser()
		{
			if (!IsUserAuthenticated)
				return null;

			return new umbraco.BusinessLogic.User(CurrentIdentity.Name);
		}

		public static IUser GetCurrentIUser()
		{
			if (!IsUserAuthenticated)
				return null;

			return ApplicationContext.Current.Services.UserService.GetByUsername(CurrentIdentity.Name);
		}
	}
}