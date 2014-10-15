using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using umbraco.BusinessLogic;
using umbraco.editorControls.tinymce;
using umbraco.editorControls.tinyMCE3;

namespace WebBlocks.DataTypes.WebBlocks
{
    /// <summary>
    /// Wrapper class for TinyMCE configuration. Loads values from tinyMCE.config
    /// </summary>
    public class WebBlocksTinyMCEConfiguration
    {
        private string _selectedButtons = "";

        #region Public Properties

        private string _plugins = "";
        public string Plugins
        {
            get
            {
                if (_plugins == "")
                    _plugins = GetTinyMCEPlugins();

                return _plugins;
            }
        }

        /// <summary>
        /// A formatted string of valid HTML elements ready for use in tinyMCE.init JS function.
        /// </summary>
        public string ValidElements
        {
            get
            {
                return tinyMCEConfiguration.ValidElements;
            }
        }

        /// <summary>
        /// A formatted string of invalid HTML elements ready for use in tinyMCE.init JS function.
        /// </summary>
        public string InvalidElements
        {
            get
            {
                return tinyMCEConfiguration.InvalidElements;
            }
        }

        private string _configOptions = "";
        /// <summary>
        /// A formatted string of additional configuration options ready for use in tinyMCE.init Js function.
        /// </summary>
        public string ConfigOptions
        {
            get
            {
                if (string.IsNullOrEmpty(_configOptions))
                    _configOptions = GetConfigOptions();

                return _configOptions;
            }
        }

        #endregion

        /// <summary>
        /// Load Plugins from tinyMCE.config and ensures some basic umbraco ones are loaded
        /// </summary>
        /// <returns>CSV string</returns>
        protected string GetTinyMCEPlugins()
        {
            string plugins = "";

            foreach (string key in tinyMCEConfiguration.Plugins.Keys)
            {
                plugins += key + ",";
            }

            AddMissingUmbracoPlugins(plugins);

            return plugins.TrimEnd(',');
        }

        /// <summary>
        /// Adds any missing plugins needed by some of the Umbraco specific features of TinyMCE.
        /// </summary>
        /// <param name="plugins"></param>
        protected void AddMissingUmbracoPlugins(string pluginList)
        {
            //This list has been pulled from the static list that was originally hard coded into the initialisation of TinyMCE on
            //WebBlocks.ascx. 
            string[] umbracoPlugins = {
                "contextmenu",
                "umbracomacro",
                "umbracoembed",
                "noneditable",
                "inlinepopups",
                "advlink",
                "spellchecker",
                "umbracoimg",
                "umbracocss",
                "umbracopaste",
                "umbracolink",
                "umbracocontextmenu"
                                      };

            pluginList = pluginList.TrimEnd(',');

            foreach (string plugin in umbracoPlugins)
            {
                if (!pluginList.ToLower().Contains(plugin.ToLower()))
                    pluginList += "," + plugin;
            }
        }

        /// <summary>
        /// Loads additonal configuration options for tinyMCE from configuration file. 
        /// </summary>
        /// <returns>Returns a string formatted ready for use in tinyMCE.init Js function.</returns>
        protected string GetConfigOptions()
        {
            string configOptions = "," + Environment.NewLine;

            foreach (string key in tinyMCEConfiguration.ConfigOptions.Keys)
            {
                string val = tinyMCEConfiguration.ConfigOptions[key].ToString();

                configOptions += string.Format("{0}: '{1}',{2}", key, val,Environment.NewLine);
            }

            return configOptions.Trim().TrimEnd(',');
        }
    }
}