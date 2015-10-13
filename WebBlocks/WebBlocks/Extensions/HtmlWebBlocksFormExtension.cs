using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Dynamic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using System.Web.Script.Serialization;
using Umbraco.Web;
using Umbraco.Web.Mvc;
using WebBlocks.API;
using WebBlocks.Utilities.WebBlocks;

namespace WebBlocks.Extensions
{
    public static class HtmlWebBlocksFormExtension
    {
        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline against a locally declared controller
        /// </summary>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="controllerName"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, string controllerName, FormMethod method)
        {
            return html.BeginWebBlockForm(action, controllerName, null, new Dictionary<string, object>(), method);
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline against a locally declared controller
        /// </summary>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="controllerName"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, string controllerName)
        {
            return html.BeginWebBlockForm(action, controllerName, null, new Dictionary<string, object>());
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline against a locally declared controller
        /// </summary>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="controllerName"></param>
        /// <param name="additionalRouteVals"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, string controllerName, object additionalRouteVals, FormMethod method)
        {
            return html.BeginWebBlockForm(action, controllerName, additionalRouteVals, new Dictionary<string, object>(), method);
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline against a locally declared controller
        /// </summary>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="controllerName"></param>
        /// <param name="additionalRouteVals"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, string controllerName, object additionalRouteVals)
        {
            return html.BeginWebBlockForm(action, controllerName, additionalRouteVals, new Dictionary<string, object>());
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline against a locally declared controller
        /// </summary>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="controllerName"></param>
        /// <param name="additionalRouteVals"></param>
        /// <param name="htmlAttributes"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, string controllerName,
                                               object additionalRouteVals,
                                               object htmlAttributes,
                                               FormMethod method)
        {
            return html.BeginWebBlockForm(action, controllerName, additionalRouteVals, HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes), method);
        }

        /// <summary>
		/// Helper method to create a new form to execute in the Umbraco request pipeline against a locally declared controller
		/// </summary>
		/// <param name="html"></param>
		/// <param name="action"></param>
		/// <param name="controllerName"></param>
		/// <param name="additionalRouteVals"></param>
		/// <param name="htmlAttributes"></param>
		/// <returns></returns>
		public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, string controllerName,
                                               object additionalRouteVals,
                                               object htmlAttributes)
        {
            return html.BeginWebBlockForm(action, controllerName, additionalRouteVals, HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes));
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline against a locally declared controller
        /// </summary>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="controllerName"></param>
        /// <param name="additionalRouteVals"></param>
        /// <param name="htmlAttributes"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, string controllerName,
                                               object additionalRouteVals,
                                               IDictionary<string, object> htmlAttributes,
                                               FormMethod method)
        {
            return html.BeginWebBlockForm(action, controllerName, "", additionalRouteVals, htmlAttributes, method);
        }

        /// <summary>
		/// Helper method to create a new form to execute in the Umbraco request pipeline against a locally declared controller
		/// </summary>
		/// <param name="html"></param>
		/// <param name="action"></param>
		/// <param name="controllerName"></param>
		/// <param name="additionalRouteVals"></param>
		/// <param name="htmlAttributes"></param>
		/// <returns></returns>
		public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, string controllerName,
                                               object additionalRouteVals,
                                               IDictionary<string, object> htmlAttributes)
        {
            return html.BeginWebBlockForm(action, controllerName, "", additionalRouteVals, htmlAttributes);
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
        /// </summary>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="surfaceType">The surface controller to route to</param>
        /// <param name="method"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, Type surfaceType, FormMethod method)
        {
            return html.BeginWebBlockForm(action, surfaceType, null, new Dictionary<string, object>(), method);
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
        /// </summary>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="surfaceType">The surface controller to route to</param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, Type surfaceType)
        {
            return html.BeginWebBlockForm(action, surfaceType, null, new Dictionary<string, object>());
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm<T>(this HtmlHelper html, string action, FormMethod method)
            where T : SurfaceController
        {
            return html.BeginWebBlockForm(action, typeof(T), method);
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm<T>(this HtmlHelper html, string action)
            where T : SurfaceController
        {
            return html.BeginWebBlockForm(action, typeof(T));
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
        /// </summary>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="surfaceType">The surface controller to route to</param>
        /// <param name="additionalRouteVals"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, Type surfaceType,
                                               object additionalRouteVals, FormMethod method)
        {
            return html.BeginWebBlockForm(action, surfaceType, additionalRouteVals, new Dictionary<string, object>(), method);
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
        /// </summary>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="surfaceType">The surface controller to route to</param>
        /// <param name="additionalRouteVals"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, Type surfaceType,
                                               object additionalRouteVals)
        {
            return html.BeginWebBlockForm(action, surfaceType, additionalRouteVals, new Dictionary<string, object>());
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="additionalRouteVals"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm<T>(this HtmlHelper html, string action, object additionalRouteVals, FormMethod method)
            where T : SurfaceController
        {
            return html.BeginWebBlockForm(action, typeof(T), additionalRouteVals, method);
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="additionalRouteVals"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm<T>(this HtmlHelper html, string action, object additionalRouteVals)
            where T : SurfaceController
        {
            return html.BeginWebBlockForm(action, typeof(T), additionalRouteVals);
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
        /// </summary>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="surfaceType">The surface controller to route to</param>
        /// <param name="additionalRouteVals"></param>
        /// <param name="htmlAttributes"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, Type surfaceType,
                                               object additionalRouteVals,
                                               object htmlAttributes,
                                               FormMethod method)
        {
            return html.BeginWebBlockForm(action, surfaceType, additionalRouteVals, HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes), method);
        }

        /// <summary>
		/// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
		/// </summary>
		/// <param name="html"></param>
		/// <param name="action"></param>
		/// <param name="surfaceType">The surface controller to route to</param>
		/// <param name="additionalRouteVals"></param>
		/// <param name="htmlAttributes"></param>
		/// <returns></returns>
		public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, Type surfaceType,
                                               object additionalRouteVals,
                                               object htmlAttributes)
        {
            return html.BeginWebBlockForm(action, surfaceType, additionalRouteVals, HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes));
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="additionalRouteVals"></param>
        /// <param name="htmlAttributes"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm<T>(this HtmlHelper html, string action,
                                                  object additionalRouteVals,
                                                  object htmlAttributes,
                                                  FormMethod method)
            where T : SurfaceController
        {
            return html.BeginWebBlockForm(action, typeof(T), additionalRouteVals, htmlAttributes, method);
        }

        /// <summary>
		/// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="html"></param>
		/// <param name="action"></param>
		/// <param name="additionalRouteVals"></param>
		/// <param name="htmlAttributes"></param>
		/// <returns></returns>
		public static MvcForm BeginWebBlockForm<T>(this HtmlHelper html, string action,
                                               object additionalRouteVals,
                                               object htmlAttributes)
            where T : SurfaceController
        {
            return html.BeginWebBlockForm(action, typeof(T), additionalRouteVals, htmlAttributes);
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
        /// </summary>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="surfaceType">The surface controller to route to</param>
        /// <param name="additionalRouteVals"></param>
        /// <param name="htmlAttributes"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, Type surfaceType,
                                               object additionalRouteVals,
                                               IDictionary<string, object> htmlAttributes,
                                               FormMethod method)
        {
            return html.BeginWebBlockForm(action, surfaceType, additionalRouteVals, htmlAttributes, method);
        }

        /// <summary>
		/// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
		/// </summary>
		/// <param name="html"></param>
		/// <param name="action"></param>
		/// <param name="surfaceType">The surface controller to route to</param>
		/// <param name="additionalRouteVals"></param>
		/// <param name="htmlAttributes"></param>
		/// <returns></returns>
		public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, Type surfaceType,
                                               object additionalRouteVals,
                                               IDictionary<string, object> htmlAttributes)
        {
            return html.BeginWebBlockForm(action, surfaceType, additionalRouteVals, htmlAttributes, FormMethod.Post);
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="additionalRouteVals"></param>
        /// <param name="htmlAttributes"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm<T>(this HtmlHelper html, string action,
                                                  object additionalRouteVals,
                                                  IDictionary<string, object> htmlAttributes,
                                                  FormMethod method)
            where T : SurfaceController
        {
            return html.BeginWebBlockForm(action, typeof(T), additionalRouteVals, htmlAttributes, method);
        }

        /// <summary>
		/// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="html"></param>
		/// <param name="action"></param>
		/// <param name="additionalRouteVals"></param>
		/// <param name="htmlAttributes"></param>
		/// <returns></returns>
		public static MvcForm BeginWebBlockForm<T>(this HtmlHelper html, string action,
                                               object additionalRouteVals,
                                               IDictionary<string, object> htmlAttributes)
            where T : SurfaceController
        {
            return html.BeginWebBlockForm(action, typeof(T), additionalRouteVals, htmlAttributes);
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
        /// </summary>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="controllerName"></param>
        /// <param name="area"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, string controllerName, string area, FormMethod method)
        {
            return html.BeginWebBlockForm(action, controllerName, area, null, new Dictionary<string, object>(), method);
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
        /// </summary>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="controllerName"></param>
        /// <param name="area"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, string controllerName, string area)
        {
            return html.BeginWebBlockForm(action, controllerName, area, null, new Dictionary<string, object>());
        }

        /// <summary>
        /// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
        /// </summary>
        /// <param name="html"></param>
        /// <param name="action"></param>
        /// <param name="controllerName"></param>
        /// <param name="area"></param>
        /// <param name="additionalRouteVals"></param>
        /// <param name="htmlAttributes"></param>
        /// <param name="method"></param>
        /// <returns></returns>
        public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, string controllerName, string area,
                                               object additionalRouteVals,
                                               IDictionary<string, object> htmlAttributes,
                                               FormMethod method)
        {
            //all call this method
            additionalRouteVals = additionalRouteVals ?? new object();
            object newAdditionalRouteVals = anonymousObjectToDictionary(additionalRouteVals);
            ((IDictionary<string,object>)newAdditionalRouteVals).Add("wbPostBackCurrentBlock", WebBlocksUtility.CurrentBlockContent.Id);
            newAdditionalRouteVals = JsonConvert.DeserializeObject(JsonConvert.SerializeObject(newAdditionalRouteVals));
            return html.BeginUmbracoForm(action, controllerName, area, newAdditionalRouteVals, htmlAttributes, method);
        }

        /// <summary>
		/// Helper method to create a new form to execute in the Umbraco request pipeline to a surface controller plugin
		/// </summary>
		/// <param name="html"></param>
		/// <param name="action"></param>
		/// <param name="controllerName"></param>
		/// <param name="area"></param>
		/// <param name="additionalRouteVals"></param>
		/// <param name="htmlAttributes"></param>
		/// <returns></returns>
		public static MvcForm BeginWebBlockForm(this HtmlHelper html, string action, string controllerName, string area,
                                               object additionalRouteVals,
                                               IDictionary<string, object> htmlAttributes)
        {
            return html.BeginWebBlockForm(action, controllerName, area, additionalRouteVals, htmlAttributes, FormMethod.Post);
        }

        private static IDictionary<string, object> anonymousObjectToDictionary(object obj)
        {
            IDictionary<string, object> result = new Dictionary<string, object>();
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(obj);
            foreach (PropertyDescriptor property in properties)
            {
                result.Add(property.Name, property.GetValue(obj));
            }
            return result;
        }
    }
}