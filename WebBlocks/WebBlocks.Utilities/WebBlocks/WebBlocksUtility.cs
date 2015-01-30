using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core.Models;
using Umbraco.Web;
using Umbraco.Web.Models;
using WebBlocks.Interfaces;
using WebBlocks.Utilities.Cache;

namespace WebBlocks.Utilities.WebBlocks
{
    public class WebBlocksUtility
    {
        public static bool IsInBuilder
        {
            get { return HttpContext.Current.Request.QueryString["wbPreview"] == "true"; }
        }

        public static int CurrentPageNodeId
        {
            get { return CacheHelper.Get<int>("wbCurrentPageNodeId"); }
            set { CacheHelper.Add("wbCurrentPageNodeId", value); }
        }

        public static IPublishedContent CurrentPageContent
        {
            get { return CacheHelper.Get<IPublishedContent>("wbCurrentPageContent"); }
            set { CacheHelper.Add("wbCurrentPageContent", value); }
        }

        public static IPublishedContent CurrentBlockContent
        {
            get { return CacheHelper.Get<IPublishedContent>("wbCurrentBlockContent"); }
            set { CacheHelper.Add("wbCurrentBlockContent", value); }
        }

        public static IContainer CurrentContainer
        {
            get { return CacheHelper.Get<IContainer>("wbCurrentContainer"); }
            set 
            {
                CacheHelper.Add("wbCurrentContainer", value);  
            }
        }
    }
}