using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core.Models;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web;

namespace WebBlocks.Utilities.Umbraco
{
    public class ContentPropertyWrapper : IPublishedProperty
    {
        Property property;
        PropertyType propertyType = null;
        PublishedContentType publishedContentType = null;

        private IPropertyValueConverter _converter;

        public ContentPropertyWrapper(Property property, PropertyType propertyType, PublishedContentType publishedContentType)
        {
            this.propertyType = propertyType;
            this.property = property;
            this.publishedContentType = publishedContentType;
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
            get 
            {
                var propertyEditor = PropertyEditorResolver.Current.GetByAlias(propertyType.PropertyEditorAlias);
                var converters = PropertyValueConvertersResolver.Current.Converters.ToArray();
                var publishedPropertyType = new PublishedPropertyType(publishedContentType, propertyType);
                //todo: resolve here
                return publishedPropertyType.ConvertDataToSource(property.Value, false); //second parameter is not used
            }
        }

        public Guid Version
        {
            get { return property.Version; }
        }

        public object XPathValue
        {
            get { return property.Value; }
        }

        //private void InitializeConverters()
        //{
        //    var converters = PropertyValueConvertersResolver.Current.Converters.ToArray();
        //    var defaultConvertersWithAttributes = PropertyValueConvertersResolver.Current.DefaultConverters;

        //    _converter = null;

        //    //get all converters for this property type
        //    // todo: remove Union() once we drop IPropertyEditorValueConverter support.
        //    var foundConverters = converters.Union(GetCompatConverters()).Where(x => x.IsConverter(this)).ToArray();
        //    if (foundConverters.Length == 1)
        //    {
        //        _converter = foundConverters[0];
        //    }
        //    else if (foundConverters.Length > 1)
        //    {
        //        //more than one was found, we need to first figure out if one of these is an Umbraco default value type converter
        //        //get the non-default and see if we have one
        //        var nonDefault = foundConverters.Except(defaultConvertersWithAttributes.Select(x => x.Item1)).ToArray();
        //        if (nonDefault.Length == 1)
        //        {
        //            //there's only 1 custom converter registered that so use it
        //            _converter = nonDefault[0];
        //        }
        //        else if (nonDefault.Length > 1)
        //        {
        //        }
        //        else
        //        {
        //            //we need to remove any converters that have been shadowed by another converter
        //            var foundDefaultConvertersWithAttributes = defaultConvertersWithAttributes.Where(x => foundConverters.Contains(x.Item1));
        //            var shadowedTypes = foundDefaultConvertersWithAttributes.SelectMany(x => x.Item2.DefaultConvertersToShadow);
        //            var shadowedDefaultConverters = foundConverters.Where(x => shadowedTypes.Contains(x.GetType()));
        //            var nonShadowedDefaultConverters = foundConverters.Except(shadowedDefaultConverters).ToArray();

        //            if (nonShadowedDefaultConverters.Length == 1)
        //            {
        //                //assign to the single default converter
        //                _converter = nonShadowedDefaultConverters[0];
        //            }
        //            else if (nonShadowedDefaultConverters.Length > 1)
        //            {
        //            }
        //        }

        //    }

        //    var converterMeta = _converter as IPropertyValueConverterMeta;

        //    // get the cache levels, quietely fixing the inconsistencies (no need to throw, really)
        //    if (converterMeta != null)
        //    {
        //        _sourceCacheLevel = converterMeta.GetPropertyCacheLevel(this, PropertyCacheValue.Source);
        //        _objectCacheLevel = converterMeta.GetPropertyCacheLevel(this, PropertyCacheValue.Object);
        //        _objectCacheLevel = converterMeta.GetPropertyCacheLevel(this, PropertyCacheValue.XPath);
        //    }
        //    else
        //    {
        //        _sourceCacheLevel = GetCacheLevel(_converter, PropertyCacheValue.Source);
        //        _objectCacheLevel = GetCacheLevel(_converter, PropertyCacheValue.Object);
        //        _objectCacheLevel = GetCacheLevel(_converter, PropertyCacheValue.XPath);
        //    }
        //    if (_objectCacheLevel < _sourceCacheLevel) _objectCacheLevel = _sourceCacheLevel;
        //    if (_xpathCacheLevel < _sourceCacheLevel) _xpathCacheLevel = _sourceCacheLevel;

        //    // get the CLR type of the converted value
        //    if (_converter != null)
        //    {
        //        if (converterMeta != null)
        //        {
        //            _clrType = converterMeta.GetPropertyValueType(this);
        //        }
        //        else
        //        {
        //            var attr = _converter.GetType().GetCustomAttribute<PropertyValueTypeAttribute>(false);
        //            if (attr != null)
        //                _clrType = attr.Type;
        //        }
        //    }
        //}

        //IEnumerable<IPropertyValueConverter> GetCompatConverters()
        //{
        //    var propertyEditorGuid = LegacyPropertyEditorIdToAliasConverter.GetLegacyIdFromAlias(PropertyEditorAlias, LegacyPropertyEditorIdToAliasConverter.NotFoundLegacyIdResponseBehavior.ReturnNull);
        //    return PropertyEditorValueConvertersResolver.HasCurrent && propertyEditorGuid.HasValue
        //        ? PropertyEditorValueConvertersResolver.Current.Converters
        //            .Where(x => x.IsConverterFor(propertyEditorGuid.Value, ContentType.Alias, PropertyTypeAlias))
        //            .Select(x => new CompatConverter(x))
        //        : Enumerable.Empty<IPropertyValueConverter>();
        //}
    }
}