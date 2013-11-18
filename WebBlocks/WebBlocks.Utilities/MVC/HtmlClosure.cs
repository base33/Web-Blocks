using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web.Models;

namespace WebBlocks.Utilities.MVC
{
    /// <summary>
    /// Closes the element at the end of a using statement
    /// </summary>
    public class HtmlClosure : IDisposable
    {
        protected HtmlHelper<RenderModel> html;
        protected string htmlToClose;

        public HtmlClosure(HtmlHelper<RenderModel> html, string htmlToClose)
        {
            this.html = html;
            this.htmlToClose = htmlToClose;
        }

        public void Dispose()
        {
            html.ViewContext.Writer.Write(htmlToClose);
        }
    }
}