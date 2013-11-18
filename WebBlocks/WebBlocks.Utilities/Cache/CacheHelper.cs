using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebBlocks.Utilities.Cache
{
    public static class CacheHelper
    {
        public static void Add<T>(string key, T value)
        {
            if (HttpContext.Current.Items[key] == null)
                HttpContext.Current.Items.Add(key, value);
            else
                HttpContext.Current.Items[key] = value;
        }

        public static T Get<T>(string key)
        {
            T o = HttpContext.Current.Items.Contains(key) ? (T)HttpContext.Current.Items[key] : default(T);
            if (o == null)
                return default(T);
            return o;
        }

        public static bool Exists(string key)
        {
            return HttpContext.Current.Cache[key] != null;
        }
    }
}