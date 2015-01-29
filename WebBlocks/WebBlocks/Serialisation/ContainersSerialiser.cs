using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using WebBlocks.Model;
using WebBlocks.Models.Angular;
using WebBlocks.Serialisation.JavascriptConverters;

namespace WebBlocks.Serialisation
{
    /// <summary>
    /// Deserialises the json that Web Blocks saves
    /// </summary>
    public class ContainersSerialiser
    {
        /// <summary>
        /// Deserialises the json into a list of container
        /// </summary>
        /// <param name="json"></param>
        /// <returns></returns>
        public AngularLayoutBuilderModel DeserialiseContainers(string json)
        {
            return JsonConvert.DeserializeObject<AngularLayoutBuilderModel>(json, new ContainersConverter());
        }

        public string SerialiseContainers(AngularLayoutBuilderModel layoutBuilder)
        {
            return JsonConvert.SerializeObject(layoutBuilder);
        }
    }
}