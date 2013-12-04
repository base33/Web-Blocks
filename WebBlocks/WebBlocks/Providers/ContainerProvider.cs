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
        /// <summary>
        /// List of all containers saved on the page
        /// </summary>
        public List<Container> Containers
        {
            get { return CacheHelper.Get<List<Container>>("wbCurrentPageContainers"); }
            set { CacheHelper.Add("wbCurrentPageContainers", value); }
        }

        /// <summary>
        /// Whether containers have been loaded already
        /// </summary>
        protected bool ContainersLoaded
        {
            get { return CacheHelper.Get<bool>("wbCurrentPageContainersLoaded"); }
            set { CacheHelper.Add("wbCurrentPageContainersLoaded", value); }
        }

        /// <summary>
        /// Initialises and loads the current page containers
        /// </summary>
        public ContainerProvider()
        {
            if (ContainersLoaded) return;
            string json = WebBlocksUtility.CurrentPageContent.GetPropertyValue("webBlocks");
            DeserialiseContainers(json);
        }

        /// <summary>
        /// Initialises and loads the containers for a specified page
        /// </summary>
        /// <param name="pageId"></param>
        public ContainerProvider(int pageId)
        {
            if (ContainersLoaded) return;
            DynamicPublishedContent content = PublishedContentProvider.Load(pageId);
            string json = WebBlocksUtility.CurrentPageContent.GetPropertyValue("webBlocks");
            DeserialiseContainers(json);
        }

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

        /// <summary>
        /// Deserialises the saved builder content
        /// </summary>
        /// <param name="json"></param>
        protected void DeserialiseContainers(string json)
        {
            ContainersSerialiser serialiser = new ContainersSerialiser();
            Containers = serialiser.DeserialiseContainers(json);
            ContainersLoaded = true;
        }
    }
}