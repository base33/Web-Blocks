using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Web.Models;
using WebBlocks.Utilities.Umbraco;

namespace WebBlocks.Providers
{
    public class PublishedContentProvider
    {
        public static DynamicPublishedContent Load(int nodeId)
        {
            return new DynamicPublishedContent(new DynamicContent(nodeId));
        }

        public static DynamicPublishedContent Load(string nodeId)
        {
            return new DynamicPublishedContent(new DynamicContent(int.Parse(nodeId)));
        }
    }
}