using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using Examine;
using Umbraco.Core;
using WebBlocks.Controllers;

namespace WebBlocks
{
    public class StartUp : ApplicationEventHandler
    {
        protected override void ApplicationStarting(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            base.ApplicationStarting(umbracoApplication, applicationContext);

            var externalIndexer = ExamineManager.Instance.IndexProviderCollection["ExternalIndexer"];
            Indexer.Indexer.IndexWebBlocks(externalIndexer);

            BlockControllerCache.BuildCache();
        }
    }
}