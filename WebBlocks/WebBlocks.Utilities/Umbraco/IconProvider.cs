using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using umbraco.cms.businesslogic.web;
using Umbraco.Core.Models;
using Umbraco.Core.Services;
using Umbraco.Web;

namespace WebBlocks.Utilities.Umbraco
{
    public class IconProvider : Dictionary<string, string>
    {
        public const string CACHEKEY = "wbDocumentTypeIcons";

        public IconProvider()
        {
            IconProvider dictionary = (IconProvider)HttpRuntime.Cache[CACHEKEY];

            if (dictionary == null)
            {
                HttpRuntime.Cache.Insert(CACHEKEY, this, null, DateTime.Now.AddHours(1), System.Web.Caching.Cache.NoSlidingExpiration);
            }
            else
            {
                foreach (string key in dictionary.Keys)
                {
                    Add(key, dictionary[key]);
                }
            }
        }

        new public string this[string key]
        {
            get 
            {
                string value = "";
                if (ContainsKey(key))
                    TryGetValue(key, out value);
                else
                {
                    var contentType = UmbracoContext.Current.Application.Services.ContentTypeService.GetContentType(key);
                    if (contentType != null)
                    {
                        value = contentType.Icon;
                        
                        this.Add(key, value);
                    }
                }
                return value; 
            }
            set { this.Add(key, value); }
        }
    }
}