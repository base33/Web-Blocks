using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using umbraco.cms.businesslogic.datatype;
using umbraco.cms.businesslogic.property;
using umbraco.cms.businesslogic.propertytype;
using umbraco.cms.businesslogic.web;
using umbraco.editorControls.tinymce;

namespace WebBlocks.DataTypes.WebBlocks
{
    public class WebBlocksPreValueRepository
    {
        public SortedList PreValues { get; private set; }
        public int DataTypeDefinitionId { get; private set; }

        #region Constructors

        public WebBlocksPreValueRepository(int dataTypeDefinitionId)
        {
            PreValues = umbraco.cms.businesslogic.datatype.PreValues.GetPreValues(dataTypeDefinitionId);
            DataTypeDefinitionId = dataTypeDefinitionId;
        }

        /// <summary>
        /// Will attempt to create an instance of <see cref="WebBlocksPreValueRepository"/> 
        /// by getting the web blocks builder from the specified node.
        /// </summary>
        /// <exception cref="InvalidOperationException">Throws InvalidOperationException if node passed does not contain web blocks builder.</exception>"
        public WebBlocksPreValueRepository(umbraco.NodeFactory.Node node)
        {
            Document d = new Document(node.Id);
            Property p = d.GenericProperties.Where(x => x.PropertyType.DataTypeDefinition.DataType.Id == new Guid("849f2844-33c5-45d6-870c-87aa7e51d55e")).FirstOrDefault();

            if (p == null)
                throw new InvalidOperationException("The current node does not contain a Web Blocks builder. NodeId: " + node.Id);

            DataTypeDefinitionId = p.PropertyType.DataTypeDefinition.Id;

            PreValues = umbraco.cms.businesslogic.datatype.PreValues.GetPreValues(DataTypeDefinitionId);
        }

        #endregion

        #region Get / Set Pre Values

        public T GetPreValue<T>(PropertyIndex propIndex, Func<PreValue, T> output, T defaultValue)
        {
            var index = (int)propIndex;
            return PreValues.Count >= index + 1 ? output((PreValue)PreValues[index]) : defaultValue;
        }

        public void SavePreValue(PropertyIndex propIndex, string value)
        {
            var index = (int)propIndex;

            if (PreValues.Count >= (index + 1))
            {
                ((PreValue)PreValues[index]).Value = value;
                ((PreValue)PreValues[index]).SortOrder = index + 1;
                ((PreValue)PreValues[index]).Save();
            }
            else
            {
                PreValue preValue = PreValue.MakeNew(DataTypeDefinitionId, value);
                preValue.SortOrder = index + 1;
                preValue.Save();
            }
        }

        #endregion

        #region Default Values

        //Specify some default values here for people who will be upgrading from an existing version of the WebBlocksBuilder
        //as they won't have pre-values set yet and this will cause the editor to look messed up!

        private string _defaultSelectedButtons = "code,undo,redo,cut,copy,pasteword,umbracocss,bold,italic,justifyleft,justifycenter,justifyright,bullist,numlist,outdent,indent,link,unlink,anchor,image,charmap,table,umbracomacro";
        private int _defaultEditorWidth = 710;
        private int _defaultEditorHeight = 400;

        #endregion

        #region Pre Value Properties

        public string RichTextEditorStylesheet
        {
            get { return GetPreValue(PropertyIndex.RichTextEditorStylesheet, x => x.Value, ""); }
            set { SavePreValue(PropertyIndex.RichTextEditorStylesheet, value); }
        }

        public int BlockSourceNodeId
        {
            get
            {
                int id = 0;

                int.TryParse(GetPreValue(PropertyIndex.BlockSourceNodeId, x => x.Value, "0"), out id);

                return id;
            }
            set { SavePreValue(PropertyIndex.BlockSourceNodeId, value.ToString()); }
        }

        public string BackEndScriptInclude
        {
            get { return GetPreValue(PropertyIndex.BackEndScriptInclude, x => x.Value, ""); }
            set { SavePreValue(PropertyIndex.BackEndScriptInclude, value); }
        }

        public string ProtectedPageUsername
        {
            get
            {
                return GetPreValue(PropertyIndex.ProtectedPageUsername, x => x.Value, "");
            }
            set { SavePreValue(PropertyIndex.ProtectedPageUsername, value); }
        }

        public string ProtectedPagePassword
        {
            get { return GetPreValue(PropertyIndex.ProtectedPagePassword, x => x.Value, ""); }
            set { SavePreValue(PropertyIndex.ProtectedPagePassword, value); }
        }

        public string ContextMenu
        {
            get { return GetPreValue(PropertyIndex.EnableRightClick, x => x.Value, ""); }
            set { SavePreValue(PropertyIndex.EnableRightClick, value); }
        }

        public string SelectedButtons
        {
            get
            {
                string buttons = GetPreValue(PropertyIndex.SelectedButtons, x => x.Value, "");
             
                if (string.IsNullOrEmpty(buttons))
                    buttons = _defaultSelectedButtons;

                return buttons;
            }
            set { SavePreValue(PropertyIndex.SelectedButtons, value); }
        }

        public int EditorWidth
        {
            get
            {
                int width = 0;

                //Ensure that someone hasn't managed to save a non integer into the pre-value field
                //and that the value is greater than 0!
                if (!int.TryParse(GetPreValue(PropertyIndex.EditorWidth, x => x.Value, ""), out width)
                    || width <= 0)
                    width = _defaultEditorWidth;

                return width;
            }
            set
            {
                SavePreValue(PropertyIndex.EditorWidth, value.ToString());
            }
        }

        public int EditorHeight
        {
            get
            {
                int height = 0;

                //Ensure that someone hasn't managed to save a non integer into the pre-value field
                //and that the value is greater than 0!
                if (!int.TryParse(GetPreValue(PropertyIndex.EditorHeight, x => x.Value, ""), out height)
                    || height <= 0)
                    height = _defaultEditorHeight;

                return height;
            }
            set
            {
                SavePreValue(PropertyIndex.EditorHeight, value.ToString());
            }
        }

        #endregion

        #region Get Pre Values Formatted methods

        //Bit of a hacky way to format the buttons with separators. Umbraco does basically the same thing in Javascript
        //for their implementation of TinyMCE
        public string GetSelectedButtonsWithSeparators()
        {
            string selectedButtons = "";

            string[] insertAfter = {
                                        "code",
                                        "pasteword",
                                        "redo", 
                                        "umbracocss",
                                        "italic",
                                        "justifyright",
                                        "indent",
                                        "anchor",
                                        "image"
                                    };

            foreach (string button in SelectedButtons.Split(','))
            {
                selectedButtons += button + ",";

                if (insertAfter.Contains(button))
                    selectedButtons += "separator,";
            }

            return selectedButtons.TrimEnd(',');
        }

        public string GetStyleStylesheetUrls()
        {
            string urls = "";

            foreach (string id in RichTextEditorStylesheet.Split(','))
            {
                StyleSheet ss = new StyleSheet(Convert.ToInt32(id));

                urls += string.Format("/css/{0}.css,", ss.Filename);
            }

            return urls.TrimEnd(',');
        }

        public string GetStylesheetStyles()
        {
            string selectedStyles = "";

            if (!string.IsNullOrEmpty(RichTextEditorStylesheet))
            {
                string[] stylesheetIds = RichTextEditorStylesheet.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

                foreach (var stylesheet in stylesheetIds.Select(s => new StyleSheet(Convert.ToInt32(s))))
                {
                    foreach (var style in stylesheet.Properties)
                    {
                        selectedStyles += string.Format("{0}={1};", style.Text, style.Alias);
                    }
                }

                selectedStyles = selectedStyles.TrimEnd(',');
            }

            return selectedStyles;
        }

        #endregion
    }
}