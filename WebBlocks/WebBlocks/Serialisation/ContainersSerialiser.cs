using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using WebBlocks.Model;
using WebBlocks.Serialisation.JavascriptConverters;

namespace WebBlocks.Serialisation
{
    /// <summary>
    /// Deserialises the json that Web Blocks saves
    /// </summary>
    public class ContainersSerialiser
    {
        /// <summary>
        /// Deserialises the JSON into a list of container
        /// </summary>
        /// <param name="json"></param>
        /// <returns></returns>
        public List<Container> DeserialiseContainers(string json)
        {
            return JsonConvert.DeserializeObject<List<Container>>(json, new ContainersConverter());
        }

        /// <summary>
        /// Serialise the list of containers into JSON
        /// </summary>
        /// <param name="containers"></param>
        /// <returns></returns>
        public string SerialiseContainers(List<Container> containers)
        {
            return JsonConvert.SerializeObject(containers);
        }
    }
}