using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Umbraco.Core.IO;
using umbraco.cms.businesslogic.datatype;
using umbraco.cms.businesslogic.web;
using umbraco.interfaces;

namespace WebBlocks.DataTypes.WebBlocks
{
    public class WebBlocksPrevalueEditor : PlaceHolder, IDataPrevalue
    {
        private readonly BaseDataType _dataType;

        public SortedList _preValues = null;

        private static readonly object m_locker = new object();

        #region Controls
        /// <summary>
        /// List of Css files available in Umbraco to populate the styles dropdown
        /// </summary>
        protected CheckBoxList ChkStylesheetList { get; set; }
        protected TextBox TxtBlockSourceNodeId { get; set; }
        protected TextBox TxtBackEndScriptInclude { get; set; }
        #endregion

        public WebBlocksPrevalueEditor(BaseDataType dataType)
        {
            _dataType = dataType;
        }

        public void Save()
        {
            _dataType.DBType = DBTypes.Ntext;

            lock (m_locker)
            {
                var vals = GetPreValues();

                //store the css document value
                SavePreValue(PropertyIndex.RichTextEditorStylesheet, GetCheckBoxSelections(ChkStylesheetList), vals);
                SavePreValue(PropertyIndex.BlockSourceNodeId, TxtBlockSourceNodeId.Text, vals);
                SavePreValue(PropertyIndex.BackEndScriptInclude, TxtBackEndScriptInclude.Text, vals);
            }
        }

        public Control Editor { get { return this; } }

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            EnsureChildControls();
            Page.ValidateRequestMode = ValidateRequestMode.Disabled;
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            SetCheckBoxBasedOnSelection(ChkStylesheetList, RichTextEditorStylesheet.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries));
            TxtBlockSourceNodeId.Text = GetPreValue(PropertyIndex.BlockSourceNodeId, x => x.Value, "-1");
            TxtBackEndScriptInclude.Text = GetPreValue(PropertyIndex.BackEndScriptInclude, x => x.Value, "");
        }

        protected override void CreateChildControls()
        {
            base.CreateChildControls();

            //create stylesheet checkbox list
            ChkStylesheetList = new CheckBoxList();
            ChkStylesheetList.ID = "ChkStylesheetList";
            StyleSheet.GetAll()
                      .ToList()
                      .ForEach(s => ChkStylesheetList.Items.Add(new ListItem(s.Text, s.Id.ToString())));

            TxtBlockSourceNodeId = new TextBox { ID = "TxtBlockSourceNodeId" };

            TxtBackEndScriptInclude = new TextBox {ID = "TxtBackEndScriptInclude", TextMode = TextBoxMode.MultiLine };

            //add the controls to get the viewstate on postbacks
            Controls.Add(ChkStylesheetList);
            Controls.Add(TxtBlockSourceNodeId);
            Controls.Add(TxtBackEndScriptInclude);
        }

        protected override void Render(HtmlTextWriter writer)
        {
            writer.AddAttribute(HtmlTextWriterAttribute.Style, "background: transparent url(" + IOHelper.ResolveUrl(SystemDirectories.Umbraco) + "/plugins/WebBlocks/images/Logo.png) no-repeat right 8px; padding-top: 40px;");
            writer.RenderBeginTag(HtmlTextWriterTag.Div);



            //render the checkbox stylesheet drop down
            writer.Write("<div style='padding-bottom:15px;'>");
            writer.Write("<div><b>Choose the master stylesheet where your Wysiwyg styles come from (needed for Richtext editor style selection drop down):</b></div>");
            writer.Write("<div>");
            ChkStylesheetList.RenderControl(writer);
            writer.Write("</div></div>");

            //render the block source node id text box
            writer.Write("<div style='padding-bottom:15px;'>");
            writer.Write("<div><b>Input the root block source node id which all available blocks are located under:</b></div>");
            writer.Write("<div>");
            TxtBlockSourceNodeId.RenderControl(writer);
            writer.Write("</div></div>");

            //render the backend script include text box
            writer.Write("<div style='padding-bottom:15px;'>");
            writer.Write("<div><b>Input the javascript and css that should be added to this builder:</b></div>");
            writer.Write("<div>");
            TxtBackEndScriptInclude.RenderControl(writer);
            writer.Write("</div></div>");

            writer.RenderEndTag();

            StringBuilder sb = new StringBuilder();
            sb.AppendFormat(
                        @"$(document).ready(function() {{
                            $('#{0}').val(decodeURI($('#{0}').val()));
                            $('form').submit(function() {{
                                $('#{0}').val(encodeURI($('#{0}').val()));
                            }});
                        }});", TxtBackEndScriptInclude.ClientID);
            Page.ClientScript.RegisterStartupScript(GetType(), "webBlocksEncoding", sb.ToString(), true);
        }

        #region Property Index
        public enum PropertyIndex
        {
            RichTextEditorStylesheet = 0,
            BlockSourceNodeId = 1,
            BackEndScriptInclude = 2
        }
        #endregion

        #region Property
        public string RichTextEditorStylesheet
        {
            get { return GetPreValue(PropertyIndex.RichTextEditorStylesheet, x => x.Value, ""); }
        }

        public int BlockSourceNodeId
        {
            get
            {
                int id = 0;

                int.TryParse(GetPreValue(PropertyIndex.BlockSourceNodeId, x => x.Value, "0"), out id);

                return id;
            }
        }

        public string BackEndScriptInclude
        {
            get { return GetPreValue(PropertyIndex.BackEndScriptInclude, x => x.Value, ""); }
        }
        #endregion

        public SortedList GetPreValues()
        {
            if (_preValues == null)
            {
                _preValues = PreValues.GetPreValues(_dataType.DataTypeDefinitionId);
            }
            return _preValues;
        }

        public void SavePreValue(PropertyIndex propIndex, string value, SortedList currentVals)
        {
            var index = (int)propIndex;

            if (currentVals.Count >= (index + 1))
            {
                ((PreValue)currentVals[index]).Value = value;
                ((PreValue)currentVals[index]).SortOrder = index + 1;
                ((PreValue)currentVals[index]).Save();
            }
            else
            {
                PreValue preValue = PreValue.MakeNew(_dataType.DataTypeDefinitionId, value);
                preValue.SortOrder = index + 1;
                preValue.Save();
            }
        }

        public T GetPreValue<T>(PropertyIndex propIndex, Func<PreValue, T> output, T defaultValue)
        {
            var index = (int)propIndex;
            var vals = GetPreValues();
            return vals.Count >= index + 1 ? output((PreValue)vals[index]) : defaultValue;
        }

        /// <summary>
        /// Helper method to return a comma-separated list of selected items in a CheckBoxList.  Needed as .SelectedValue only returns one item.
        /// </summary>
        /// <param name="cbl"></param>
        /// <returns></returns>
        private string GetCheckBoxSelections(CheckBoxList cbl)
        {
            string selectedValues = string.Empty;

            foreach (ListItem li in cbl.Items)
            {
                if (li.Selected)
                {
                    selectedValues += li.Value + ",";
                }
            }

            selectedValues = selectedValues.TrimEnd(',');

            return selectedValues;
        }

        /// <summary>
        /// Helper method to set a check
        /// </summary>
        /// <param name="cbl"></param>
        /// <param name="valueArray"></param>
        private void SetCheckBoxBasedOnSelection(CheckBoxList cbl, string[] valueArray)
        {
            foreach (ListItem li in cbl.Items)
            {
                if (valueArray.Contains(li.Value))
                {
                    li.Selected = true;
                }
            }
        }
    }
}