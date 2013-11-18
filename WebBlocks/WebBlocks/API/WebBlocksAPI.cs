using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Utilities.Cache;

namespace WebBlocks.API
{
    public class WebBlocksAPI
    {
        public List<string> CssClasses
        {
            get 
            {
                if (!CacheHelper.Exists("wbCssClasses"))
                    CacheHelper.Add("wbCssClasses", new List<string>());
                return CacheHelper.Get<List<string>>("wbCssClasses"); 
            }
            set { CacheHelper.Add("wbCssClasses", value); }
        }
    }
}