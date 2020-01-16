using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using umbraco.BusinessLogic;
using Umbraco.Core.Models;
using Umbraco.Web.Models;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;
using WebBlocks.Models.Navigation;

namespace WebBlocks.Controllers
{
    [PluginController("WebBlocks")]
    public class WebBlocksApiController : UmbracoAuthorizedApiController
    {
        /// <summary>
        /// Url: /umbraco/backoffice/WebBlocks/WebBlocksApi/GetChildren?id={id} sample: 1052
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public IEnumerable<NavigationItem> GetChildren(int id)
        {
            var contentService = UmbracoContext.Application.Services.ContentService;

            return contentService.GetChildren(id)
                .Select(c => new NavigationItem { Id = c.Id, Name = c.Name, ContentType = c.ContentType.Alias, IconClass = c.ContentType.Icon, HasChildren = c.Children().Any() });
        }

        [HttpGet]
        public LoggedInStateResult LogIn(string username)
        {
            var frontEndMemberName = string.Empty;
            var cookieCollection = Request.Headers.GetCookies().FirstOrDefault();
            if (cookieCollection != null)
            {
                var cookieName = "yourAuthCookie";
                var cookie = cookieCollection.Cookies.FirstOrDefault(x => x.Name == cookieName);
                
                if (cookie != null)
                {
                    var ticket = FormsAuthentication.Decrypt(cookie.Value);
                    frontEndMemberName = ticket.Name;
                    FormsAuthentication.SetAuthCookie(frontEndMemberName, true);
                }
                else
                {
                    FormsAuthentication.SetAuthCookie(username, true);
                }
            }
            else
            {
                FormsAuthentication.SetAuthCookie(username, true);
            }

           
            return new LoggedInStateResult
            {
                Success = true,
                Username = frontEndMemberName
            };
        }

        [HttpGet]
        public LoggedInStateResult LogOut(string username)
        {
            FormsAuthentication.SignOut();

            if (!string.IsNullOrEmpty(username))
            {
                FormsAuthentication.SetAuthCookie(username, true);
            }

            return new LoggedInStateResult
            {
                Success = true
            };
        }

        /// <summary>
        /// Url: /umbraco/backoffice/WebBlocks/WebBlocksApi/GetPagePreview?id={id} sample: 1052
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public HttpResponseMessage GetPagePreview(int id)
        {
            var user = new User(Services.UserService.GetByUsername(HttpContext.Current.User.Identity.Name).Id);
            var d = new umbraco.cms.businesslogic.web.Document(id);
            var pc = new umbraco.presentation.preview.PreviewContent(user, Guid.NewGuid(), false);
            pc.PrepareDocument(user, d, true);
            pc.SavePreviewSet();
            pc.ActivatePreviewCookie();
            var response = Request.CreateResponse<string>(System.Net.HttpStatusCode.Redirect, "");
            response.Headers.Location = new Uri(
                string.Format("/{0}.aspx?wbPreview=true",
                    d.Id.ToString(CultureInfo.InvariantCulture)), UriKind.Relative);
            return response;
        }


        //public WebBlockRenderModel RenderWebBlock(int id)
        //{
        //    //Stream filter = Stream.Null;
        //    //StreamWriter writer = new StreamWriter(filter);
        //    //var viewContext = new ViewContext((ControllerContext)this.ControllerContext,
        //    //    new WebFormView("MyView"),
        //    //    new ViewDataDictionary(),
        //    //    new TempDataDictionary(), writer);
        //    //var helper = new HtmlHelper<RenderModel>(viewContext, new ViewPage());
        //    return new WebBlockRenderModel();
        //}
    }

    public class LoggedInStateResult
    {
        public bool Success { get; set; }
        public string Username { get; set; }
    }
}