using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Web;
using Umbraco.Web.Models;
using WebBlocks.Models.Angular;
using WebBlocks.Utilities.MVC;
using WebBlocks.Utilities.WebBlocks;

namespace WebBlocks.Extensions
{
    public static class HtmlWebBlocksBuilderExtension
    {
        /// <summary>
        /// Renders a div to tell the builder to show the contents of this element in the backoffice
        /// 
        /// Implement like:
        /// using(@Html.WebBlocksBuilder())
        /// {
        ///     <!-- content -->
        /// }
        /// </summary>
        /// <param name="html"></param>
        /// <returns></returns>
        public static IDisposable WebBlocksBuilder<TModel>(this HtmlHelper<TModel> html)
        {
            bool isInBuilder = WebBlocksUtility.IsInBuilder;
            
            //if the page is being rendered from the builder then render the element
            if (isInBuilder)
                html.ViewContext.Writer.Write("<div class='wbLayout'>");

            return new LayoutBuilderClosure<TModel>(html, isInBuilder ? "</div>" : "");
        }



        public class LayoutBuilderClosure<TModel> : IDisposable
        {
            protected HtmlHelper<TModel> html;
            protected string htmlToClose;

            public LayoutBuilderClosure(HtmlHelper<TModel> html, string htmlToClose)
            {
                this.html = html;
                this.htmlToClose = htmlToClose;
            }

            public void Dispose()
            {
                var containersBuilder = AngularContainersBuilder.Load();
                string containersJSON = containersBuilder.ConvertToJSON();
                if(htmlToClose != "")
                    html.ViewContext.Writer.Write("<script type='text/javascript' id='wbContainerJSON'>{0}</script>", containersJSON);
                html.ViewContext.Writer.Write(htmlToClose);
            }
        }

    }
}