using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Umbraco.Web.Mvc;
using WebBlocks.SandboxV7.Models;

namespace WebBlocks.SandboxV7.Controllers
{
	public class MembershipController : SurfaceController
	{
		public ActionResult RenderLogin()
		{
			LoginViewModel viewModel = new LoginViewModel();
			viewModel.RedirectUrl = Request.QueryString["returnurl"] != null ? Request.QueryString["returnurl"] : HttpContext.Request.RawUrl;

			return PartialView("LoginBlock", viewModel);
		}

		[HttpPost]
		public ActionResult HandleLogin(LoginViewModel viewModel)
		{
			if (!Members.Login(viewModel.Username, viewModel.Password))
			{
				TempData["LoginError"] = "Invalid username or password";
				return RedirectToCurrentUmbracoPage();
			}

			FormsAuthentication.SetAuthCookie(viewModel.Username, true);
			return Redirect(viewModel.RedirectUrl);
		}
	}
}