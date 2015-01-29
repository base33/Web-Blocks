using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebBlocks.Utilities.Cache;

namespace WebBlocks.Models.Angular
{
    /// <summary>
    /// This class is used to build the containers model ready to inject into the layout builder.  
    /// This can then be mapped to the typed models
    /// </summary>
    public class AngularContainersBuilder
    {
        protected const string CACHEKEY = "wbAngularContainersModel";
        protected Dictionary<string, AngularContainer> Containers { get; set; }
        protected AngularContainer CurrentContainer { get; set; }

        protected AngularContainersBuilder()
        {
            Containers = new Dictionary<string, AngularContainer>();
        }

        public static AngularContainersBuilder Load()
        {
            if (CacheHelper.Exists(CACHEKEY))
                return CacheHelper.Get<AngularContainersBuilder>(CACHEKEY);
            else
            {
                var containersBuilder = new AngularContainersBuilder();
                CacheHelper.Add(CACHEKEY, containersBuilder);
                return containersBuilder;
            }
        }

        /// <summary>
        /// Adds a container to the list and sets it to the current container
        /// </summary>
        /// <param name="container"></param>
        /// <returns></returns>
        public void AddContainer(AngularContainer container)
        {
            Containers.Add(container.Name, container);
            CurrentContainer = container;
        }

        public void AddBlockToCurrentContainer(AngularBlock block)
        {
            CurrentContainer.Blocks.Add(block);
        }

        public string ConvertToJSON()
        {
            return JsonConvert.SerializeObject(Containers);
        }
    }
}