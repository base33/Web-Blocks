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
    public class WebBlocksViewPage<T> : Umbraco.Web.Mvc.UmbracoViewPage<T>
    {
        internal IPublishedContent currentPage = null;
        internal IPublishedContent currentBlock = null;

        public IPublishedContent CurrentPage
        {
            get
            {
                return currentPage ?? (currentPage = WebBlocksUtility.CurrentPageContent);
            }
        }

        public IPublishedContent CurrentBlock
        {
            get
            {
                //return published model
                return currentBlock ?? (currentBlock = WebBlocksUtility.CurrentBlockContent);
            }
        }

        public WebBlocksAPI CurrentBlockContext = new WebBlocksAPI();

        public bool IsInBuilder()
        {
            return WebBlocksUtility.IsInBuilder;
        }


        public override void Execute()
        {
            
        }
    }

    public class WebBlocksViewPage : WebBlocksViewPage<IPublishedContent>
    {
        
    }
}