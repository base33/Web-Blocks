using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace WebBlocks.Utilities.Umbraco
{
    public class DynamicContentProperty : IPublishedProperty
    {
        Property property;

        public DynamicContentProperty(Property property)
        {
            this.property = property;
        }

        public string Alias
        {
            get { return property.Alias; }
        }

        public object DataValue
        {
            get { return property.Value; }
        }

        public bool HasValue
        {
            get { return property.Value != null; }
        }

        public string PropertyTypeAlias
        {
            get { return property.Alias; }
        }

        public object Value
        {
            get { return property.Value; }
        }

        public Guid Version
        {
            get { return property.Version; }
        }

        public object XPathValue
        {
            get { return property.Value; }
        }
    }
}