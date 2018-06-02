using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using WebBlocks.Interfaces;
using WebBlocks.Models.Angular;

namespace WebBlocks.Serialisation.JavascriptConverters
{
    /// <summary>
    /// Converter to ensure blocks are typed as NodeBlock or WysiwygBlock respectively
    /// </summary>
    public class IBlockConverter : Newtonsoft.Json.Converters.CustomCreationConverter<IBlock>
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
                    jObject.Remove("Content");
                    return new ContentBlock();
                case "WysiwygBlock":
                    return new WysiwygBlock();
                case "ElementBlock":
                    return new ElementBlock();
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