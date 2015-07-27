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
		const string BackofficeIdentityKey = "UmbracoBackofficeIdentity";

		/// <summary>
		/// The <c>UmbracoBackOfficeIdentity</c> representing the currently logged on Back Office user
		/// </summary>
		public static UmbracoBackOfficeIdentity CurrentIdentity
		{
			get
			{
				if (!HttpContext.Current.Items.Contains(BackofficeIdentityKey))
					HttpContext.Current.Items[BackofficeIdentityKey] = new HttpContextWrapper(HttpContext.Current).GetCurrentIdentity(true);

				return (UmbracoBackOfficeIdentity)HttpContext.Current.Items[BackofficeIdentityKey];
			}
		}

		/// <summary>
		/// Determines if there is currently a back office user logged on.
		/// </summary>
		public static bool IsUserAuthenticated
		{
			get
			{
				return CurrentIdentity.IsAuthenticated;
			}
		}

		/// <summary>
		/// Get the Currently logged on backoffice user as old <c>umbraco.BusinessLogic.User</c>
		/// </summary>
		/// <returns><c>umbraco.BusinessLogic.User</c> if a user is logged on, otherwise null</returns>
		public static umbraco.BusinessLogic.User GetCurrentUser()
		{
			if (!IsUserAuthenticated)
				return null;

			return new umbraco.BusinessLogic.User(CurrentIdentity.Name);
		}

		/// <summary>
		/// Get the currently logged on backoffice user as new <c>IUser</c>
		/// </summary>
		/// <returns><c>IUser</c> if a user is logged on, otherwise null</returns>
		public static IUser GetCurrentIUser()
		{
			if (!IsUserAuthenticated)
				return null;

			return ApplicationContext.Current.Services.UserService.GetByUsername(CurrentIdentity.Name);
		}
	}
}