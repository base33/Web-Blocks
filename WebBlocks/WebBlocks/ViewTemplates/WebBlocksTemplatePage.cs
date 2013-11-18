using Umbraco.Core.Models;
using Umbraco.Web;
using Umbraco.Web.Models;
using WebBlocks.API;
using WebBlocks.Providers;
using WebBlocks.Utilities.Cache;
using WebBlocks.Utilities.Umbraco;
using WebBlocks.Utilities.WebBlocks;

namespace WebBlocks.ViewTemplates
{
    public class WebBlocksTemplatePage : Umbraco.Web.Mvc.UmbracoTemplatePage
    {
        new public dynamic CurrentPage
        {
            get
            {
                if (WebBlocksUtility.CurrentPageContent == null)
                {
                    if (WebBlocksUtility.IsInBuilder || UmbracoContext.InPreviewMode)
                    {
                        if (WebBlocksUtility.CurrentPageNodeId == 0)
                            WebBlocksUtility.CurrentPageNodeId = UmbracoContext.Current.PageId ?? 0;
                        WebBlocksUtility.CurrentPageContent = PublishedContentProvider.Load(WebBlocksUtility.CurrentPageNodeId);
                    }
                    else
                    {
                        WebBlocksUtility.CurrentPageContent = new DynamicPublishedContent((new UmbracoHelper(UmbracoContext)).TypedContent(UmbracoContext.Current.PageId));
                    }
                }

                return WebBlocksUtility.CurrentPageContent;
            }
        }

        public dynamic CurrentBlock
        {
            get
            {
                //return published model
                return WebBlocksUtility.CurrentBlockContent;
            }
        }

        public WebBlocksAPI WebBlocks = new WebBlocksAPI();

        public bool IsInBuilder()
        {
            return WebBlocksUtility.IsInBuilder;
        }


        public override void Execute()
        {
            
        }
    }
}