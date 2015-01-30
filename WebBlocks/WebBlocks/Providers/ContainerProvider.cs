using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Web;
using Umbraco.Web.Models;
using WebBlocks.Model;
using WebBlocks.Models.Angular;
using WebBlocks.Serialisation;
using WebBlocks.Serialisation.JavascriptConverters;
using WebBlocks.Utilities.Cache;
using WebBlocks.Utilities.Umbraco;
using WebBlocks.Utilities.WebBlocks;

namespace WebBlocks.Providers
{
    /// <summary>
    /// Provides access to the current page containers
    /// </summary>
    public class LayoutBuilderProvider
    {
        public AngularLayoutBuilderModel LayoutBuilder { get; set; }

        /// <summary>
        /// Initialises and loads the current page containers
        /// </summary>
        public LayoutBuilderProvider()
        {
            var property = WebBlocksUtility.CurrentPageContent.GetProperty("webblocks");
            var layoutBuilderObj = property != null ? property.Value : null;
            if (layoutBuilderObj != null)
            {
                var jsonSerialiser = new JsonSerializer();
                jsonSerialiser.Converters.Add(new IBlockConverter());
                jsonSerialiser.Converters.Add(new IContainerConverter());
                jsonSerialiser.Converters.Add(new IBlockElementAttributeConverter());
                LayoutBuilder = ((JObject)layoutBuilderObj).ToObject<AngularLayoutBuilderModel>(jsonSerialiser);
            }
            else
                LayoutBuilder = new AngularLayoutBuilderModel();
            //TODO: look into property editor model
            //LoadLayoutBuilderFromJson(json, true, WebBlocksUtility.CurrentPageNodeId.ToString());
        }

        /// <summary>
        /// Get a container by id
        /// </summary>
        /// <param name="name">name of the container</param>
        /// <returns>The container</returns>
        public AngularContainer ContainerByName(string name)
        {
            if (LayoutBuilder == null) return null;
            return LayoutBuilder.Containers.FirstOrDefault(c => c.Key == name).Value;
        }
    }
}



//#region Loading Methods
///// <summary>
///// Loads the containers for the given page and caches it if specified
///// </summary>
///// <param name="pageId">The page id</param>
///// <param name="cacheForRequestLife">Whether to cache for the life of the request</param>
//protected void LoadPageLayoutBuilder(int pageId, bool cacheForRequestLife)
//{
//    string cacheId = "wbPageContainers_" + pageId.ToString();

//    if (cacheForRequestLife && CacheHelper.Exists(cacheId))
//    {
//        //load from cache
//        var containerProvider = CacheHelper.Get<LayoutBuilderProvider>(cacheId);
//        LayoutBuilder = containerProvider.LayoutBuilder;
//    }
//    else
//    {
//        //load from Umbraco
//        DynamicPublishedContent content = PublishedContentProvider.Load(pageId);

//        if (content == null)
//            return;

//        string json = content.GetPropertyValue<string>("webBlocks");
//        if(!string.IsNullOrEmpty(json))
//            LoadLayoutBuilderFromJson(json,  cacheForRequestLife, pageId.ToString());
//    }
//}

///// <summary>
///// Loads containers from JSON into the current Container Provider and 
///// caches the result for the life of the request
///// </summary>
///// <param name="json">The json for the list of containers</param>
///// <param name="cacheForRequestLife">whether to cache the deserialised list</param>
///// <param name="uniqueKey">the unique key used for the cache if cacheForRequestLife is set to true</param>
//protected void LoadLayoutBuilderFromJson(string json, bool cacheForRequestLife, string uniqueKey)
//{
//    string cacheId = "wbPageContainers_" + uniqueKey;

//    if (cacheForRequestLife && CacheHelper.Exists(cacheId))
//    {
//        //load from cache
//        var layoutBuilderProvider = CacheHelper.Get<LayoutBuilderProvider>(cacheId);
//        LayoutBuilder = layoutBuilderProvider.LayoutBuilder;
//    }
//    else
//    {
//        LayoutBuilder = DeserialiseLayoutBuilder(json);
//        if(cacheForRequestLife)
//            CacheHelper.Add(cacheId, this);
//    }
//}

///// <summary>
///// Deserialises the saved builder content
///// </summary>
///// <param name="json"></param>
//protected AngularLayoutBuilderModel DeserialiseLayoutBuilder(string json)
//{
//    var serialiser = new LayoutBuilderSerialiser();
//    return serialiser.Deserialise(json);
//}
//#endregion