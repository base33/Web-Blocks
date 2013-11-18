using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using WebBlocks.Interfaces;
using WebBlocks.Model;

namespace WebBlocks.Serialisation.JavascriptConverters
{
    /// <summary>
    /// Converter to ensure blocks are typed as NodeBlock or WysiwygBlock respectively
    /// </summary>
    public class ContainersConverter : Newtonsoft.Json.Converters.CustomCreationConverter<IBlock>
    {
        public override IBlock Create(Type objectType)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Resolves and returns the correct type
        /// </summary>
        /// <param name="objectType"></param>
        /// <param name="jObject"></param>
        /// <returns></returns>
        public IBlock Create(Type objectType, JObject jObject)
        {
            var type = (string)jObject.Property("__type");

            switch (type)
            {
                case "NodeBlock":
                    return new NodeBlock();
                case "WysiwygBlock":
                    return new WysiwygBlock();
            }

            throw new ApplicationException(String.Format("The block type {0} is not supported!", type));
        }


        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            // Load JObject from stream 
            JObject jObject = JObject.Load(reader);

            // Create target object based on JObject 
            var target = Create(objectType, jObject);

            // Populate the object properties 
            serializer.Populate(jObject.CreateReader(), target);

            return target;
        }
    }
}