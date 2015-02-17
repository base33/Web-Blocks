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
using WebBlocks.Models.Angular;

namespace WebBlocks.Serialisation.JavascriptConverters
{
    /// <summary>
    /// Converter to ensure blocks are typed as NodeBlock or WysiwygBlock respectively
    /// </summary>
    public class IContainerPermissionsConverter : Newtonsoft.Json.Converters.CustomCreationConverter<IContainerPermissions>
    {
        public override IContainerPermissions Create(Type objectType)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Resolves and returns the correct type
        /// </summary>
        /// <param name="objectType"></param>
        /// <param name="jObject"></param>
        /// <returns></returns>
        public IContainerPermissions Create(Type objectType, JObject jObject)
        {
            var type = (string)jObject.Property("__type");

            switch (type)
            {
                case "AllowedBlocks":
                    return new AllowedBlocks();
                case "ExcludedBlocks":
                    return new ExcludedBlocks();
            }

            throw new ApplicationException(String.Format("{0} is not supported!", type));
        }


        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            if (reader.Value == null) return null;

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