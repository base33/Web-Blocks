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
        private dynamic currentPage = null;
        public dynamic currentBlock = null;

        new public dynamic CurrentPage
        {
            get
            {
                return currentPage ?? (currentPage = WebBlocksUtility.CurrentPageContent.AsDynamic());
            }
        }

        public dynamic CurrentBlock
        {
            get
            {
                //return published model
                return currentBlock ?? (currentBlock = WebBlocksUtility.CurrentBlockContent.AsDynamic());
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