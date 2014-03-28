using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Web.Models;
using WebBlocks.Model;
using WebBlocks.Serialisation;
using WebBlocks.Utilities.Cache;
using WebBlocks.Utilities.Umbraco;
using WebBlocks.Utilities.WebBlocks;

namespace WebBlocks.Providers
{
    /// <summary>
    /// Provides access to the current page containers
    /// </summary>
    public class ContainerProvider
    {
        protected List<Container> containers = new List<Container>();

        /// <summary>
        /// List of all containers saved on the page
        /// </summary>
        public List<Container> Containers
        {
            get { return containers; }
            set { containers = value; }
        }

        /// <summary>
        /// Initialises and loads the current page containers
        /// </summary>
        public ContainerProvider()
        {
            var json = WebBlocksUtility.CurrentPageContent.GetPropertyValue("webBlocks");
            LoadContainersFromJson(json, true, WebBlocksUtility.CurrentPageNodeId.ToString());
        }

        /// <summary>
        /// Initialises and loads the containers for a specified page
        /// </summary>
        /// <param name="pageId"></param>
        /// <param name="cacheForRequestLife">Should the containers for this page be cached (recommended if recalling the same page containers twice)</param>
        public ContainerProvider(int pageId, bool cacheForRequestLife = false)
        {
            LoadPageContainers(pageId, cacheForRequestLife);
        }

        #region Loading Methods
        /// <summary>
        /// Loads the containers for the given page and caches it if specified
        /// </summary>
        /// <param name="pageId">The page id</param>
        /// <param name="cacheForRequestLife">Whether to cache for the life of the request</param>
        protected void LoadPageContainers(int pageId, bool cacheForRequestLife)
        {
            string cacheId = "wbPageContainers_" + pageId.ToString();

            if (cacheForRequestLife && CacheHelper.Exists(cacheId))
            {
                //load from cache
                var containerProvider = CacheHelper.Get<ContainerProvider>(cacheId);
                containers = containerProvider.containers;
            }
            else
            {
                //load from Umbraco
                DynamicPublishedContent content = PublishedContentProvider.Load(pageId);

                if (content == null)
                    return;

                string json = content.GetPropertyValue("webBlocks");
                if(!string.IsNullOrEmpty(json))
                    LoadContainersFromJson(json,  cacheForRequestLife, pageId.ToString());
            }
        }

        /// <summary>
        /// Loads containers from JSON into the current Container Provider and 
        /// caches the result for the life of the request
        /// </summary>
        /// <param name="json">The json for the list of containers</param>
        /// <param name="cacheForRequestLife">whether to cache the deserialised list</param>
        /// <param name="uniqueKey">the unique key used for the cache if cacheForRequestLife is set to true</param>
        protected void LoadContainersFromJson(string json, bool cacheForRequestLife, string uniqueKey)
        {
            string cacheId = "wbPageContainers_" + uniqueKey;

            if (cacheForRequestLife && CacheHelper.Exists(cacheId))
            {
                //load from cache
                var containerProvider = CacheHelper.Get<ContainerProvider>(cacheId);
                containers = containerProvider.containers;
            }
            else
            {
                containers = DeserialiseContainers(json);
                if(cacheForRequestLife)
                    CacheHelper.Add(cacheId, this);
            }
        }

        /// <summary>
        /// Deserialises the saved builder content
        /// </summary>
        /// <param name="json"></param>
        protected List<Container> DeserialiseContainers(string json)
        {
            var serialiser = new ContainersSerialiser();
            return serialiser.DeserialiseContainers(json);
        }
        #endregion

        /// <summary>
        /// Get a container by id
        /// </summary>
        /// <param name="name">name of the container</param>
        /// <returns>The container</returns>
        public Container ContainerByName(string name)
        {
            if (Containers == null) return null;
            return Containers.FirstOrDefault(c => c.Name == name);
        }
    }
}