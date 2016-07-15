using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using umbraco;
using umbraco.BusinessLogic;
using umbraco.cms.businesslogic.datatype;
using umbraco.cms.businesslogic.web;
using umbraco.editorControls.tinymce;
using umbraco.interfaces;
using Umbraco.Core.IO;

namespace WebBlocks.DataTypes.WebBlocks
{
    public class WebBlocksPrevalueEditor : PlaceHolder, IDataPrevalue
    {
        private static readonly object m_locker = new object();

        protected BaseDataType _dataType = null;
        protected WebBlocksPreValueRepository _preValues;

        public int DataTypeDefinitionId { get { return _dataType.DataTypeDefinitionId; } }

        public WebBlocksPrevalueEditor(BaseDataType baseDataType, WebBlocksPreValueRepository repo)
        {
            _dataType = baseDataType;
            _preValues = repo;
        }

        #region Render Backend Settings Controls

        #region Input Controls

        protected CheckBoxList _chklstStylesheets { get; set; }
        protected TextBox _txtBlockSourceNodeId { get; set; }
        protected TextBox _txtBackEndScriptInclude { get; set; }
        protected TextBox _txtUsername { get; set; }
        protected TextBox _txtPassword { get; set; }
        protected CheckBoxList _chklstSelectedButtons { get; set; }
        protected CheckBox _chkEnableRightClick { get; set; }
        protected TextBox _txtWidth { get; set; }
        protected TextBox _txtHeight { get; set; }

        #endregion

        protected override void CreateChildControls()
        {
            base.CreateChildControls();

            _chklstSelectedButtons = new CheckBoxList() { ID = "editorButtons" };
            _chklstSelectedButtons.RepeatColumns = 4;
            _chklstSelectedButtons.CellPadding = 3;
            Controls.Add(_chklstSelectedButtons);

            _chkEnableRightClick = new CheckBox() { ID = "enableRightClick" };
            Controls.Add(_chkEnableRightClick);

            _chklstStylesheets = new CheckBoxList() { ID = "stylesheetList" };
            Controls.Add(_chklstStylesheets);

            _txtBlockSourceNodeId = new TextBox { ID = "_txtBlockSourceNodeId" };
            Controls.Add(_txtBlockSourceNodeId);

            _txtBackEndScriptInclude = new TextBox { ID = "_txtBackEndScriptInclude", TextMode = TextBoxMode.MultiLine, Width = 550, Height = 100 };
            Controls.Add(_txtBackEndScriptInclude);

            _txtUsername = new TextBox { ID = "_txtUsername" };
            Controls.Add(_txtUsername);

            _txtPassword = new TextBox { ID = "_txtPassword", TextMode = TextBoxMode.Password };
            Controls.Add(_txtPassword);

            _txtWidth = new TextBox { ID = "_txtWidth", Width = 50 };
            Controls.Add(_txtWidth);

            _txtHeight = new TextBox { ID = "_txtHeight", Width = 50 };
            Controls.Add(_txtHeight);
        }

        protected override void Render(System.Web.UI.HtmlTextWriter writer)
        {
            //base.Render(writer);

            writer.Write("<div style=\"background: transparent url(" + IOHelper.ResolveUrl(SystemDirectories.Umbraco) + "/plugins/WebBlocks/images/Logo.png) no-repeat right 8px; padding-top: 40px;\">");

            writer.Write("<b>Web Blocks Specific Settings</b><br /><br />");

            writer.Write("<table>");

            writer.Write("<tr><th>Input the root block source node id which all available blocks are located under:<br /><br /></th><td>");
            _txtBlockSourceNodeId.RenderControl(writer);
            writer.Write("</td></tr>");

            writer.Write("<tr><th>Input the javascript and css that should be added to this builder:<br /><br /></th><td>");
            _txtBackEndScriptInclude.RenderControl(writer);
            writer.Write("</td></tr>");

            writer.Write("<tr><th>Protected page username (required to render the preview of a protected page):<br /><br /></th><td>");
            _txtUsername.RenderControl(writer);
            writer.Write("</td></tr>");

            writer.Write("<tr><th>Protected page password (required to render the preview of a protected page):<br /><br /></th><td>");
            _txtPassword.RenderControl(writer);
            writer.Write("</td></tr>");

            writer.Write("</table>");

            writer.Write("<hr />");

            writer.Write("<b>TinyMCE Settings</b><br /><br />");


            writer.WriteLine("<table>");
            writer.Write("<tr><th>" + ui.Text("editdatatype", "rteButtons") + ":</th><td>");
            _chklstSelectedButtons.RenderControl(writer);
            writer.Write("</td></tr>");
            writer.Write("<tr><th>" + ui.Text("editdatatype", "rteRelatedStylesheets") + ":</th><td>");
            _chklstStylesheets.RenderControl(writer);
            writer.Write("</td></tr>");
            writer.Write("<tr><th>" + ui.Text("editdatatype", "rteEnableContextMenu") + ":</th><td>");
            _chkEnableRightClick.RenderControl(writer);
            writer.Write("</td></tr>");
            writer.Write("<tr><th>Editor Width x Height:</th><td>");
            _txtWidth.RenderControl(writer);
            writer.Write(" x ");
            _txtHeight.RenderControl(writer);
            writer.Write("</table>");


            writer.Write("</div>");

            StringBuilder sb = new StringBuilder();
            sb.AppendFormat(
                        @"$(document).ready(function() {{
                            $('#{0}').val(decodeURI($('#{0}').val()));
                            $('form').submit(function() {{
                                $('#{0}').val(encodeURI($('#{0}').val()));
                            }});
                        }});", _txtBackEndScriptInclude.ClientID);
            Page.ClientScript.RegisterStartupScript(GetType(), "webBlocksEncoding", sb.ToString(), true);
        }

        #endregion

        #region Page Event Overrides

        protected override void OnInit(EventArgs e)
        {
            if (_preValues == null)
                _preValues = new WebBlocksPreValueRepository(DataTypeDefinitionId);

            base.OnInit(e);
            EnsureChildControls();
            Page.ValidateRequestMode = ValidateRequestMode.Disabled;
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            if (!Page.IsPostBack && _preValues != null)
            {
                GetSelectedButtonsCheckList(_preValues.SelectedButtons);
                SetCheckBox(_chkEnableRightClick, _preValues.ContextMenu);
                GetStylesheetsCheckList(_preValues.RichTextEditorStylesheet);

                _txtBlockSourceNodeId.Text = _preValues.BlockSourceNodeId.ToString();
                _txtBackEndScriptInclude.Text = _preValues.BackEndScriptInclude;
                _txtUsername.Text = _preValues.ProtectedPageUsername;
                _txtPassword.Attributes.Add("value", _preValues.ProtectedPagePassword);
                _txtWidth.Text = _preValues.EditorWidth.ToString();
                _txtHeight.Text = _preValues.EditorHeight.ToString();
            }
        }

        #endregion

        #region Helper Methods

        /// <summary>
        /// Helper method to return a comma-separated list of selected items in a CheckBoxList.  Needed as .SelectedValue only returns one item.
        /// </summary>
        /// <param name="cbl"></param>
        /// <returns></returns>
        protected string GetCheckBoxSelections(CheckBoxList cbl)
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

        protected string GetCheckBoxChecked(CheckBox chk)
        {
            return (chk.Checked) ? "1" : "0";
        }

        protected void SetCheckBox(CheckBox chk, string value)
        {
            if (value == "1")
                chk.Checked = true;
        }

        /// <summary>
        /// Helper method to check any check box items found in valueArray
        /// </summary>
        /// <param name="cbl"></param>
        /// <param name="valueArray"></param>
        protected void SetCheckBoxList(CheckBoxList cbl, string[] valueArray)
        {
            foreach (ListItem li in cbl.Items)
            {
                if (valueArray.Contains(li.Value))
                {
                    li.Selected = true;
                }
            }
        }

        private void GetStylesheetsCheckList(string stylesheets)
        {
            // add stylesheets
            foreach (StyleSheet st in StyleSheet.GetAll())
            {
                ListItem li = new ListItem(st.Text, st.Id.ToString());
                if (("," + stylesheets + ",").IndexOf("," + st.Id.ToString() + ",") > -1)
                    li.Selected = true;

                _chklstStylesheets.Items.Add(li);
            }
        }


        private void GetSelectedButtonsCheckList(string selectedButtons)
        {
            // add editor buttons
            IDictionaryEnumerator ide = tinyMCEConfiguration.SortedCommands.GetEnumerator();
            while (ide.MoveNext())
            {
                tinyMCECommand cmd = (tinyMCECommand)ide.Value;
                ListItem li =
                    new ListItem(
                        string.Format("<img src=\"{0}\" class=\"tinymceIcon\" alt=\"{1}\" />&nbsp;", cmd.Icon,
                                      cmd.Command), cmd.Command);
                if (selectedButtons.IndexOf(cmd.Command) > -1)
                    li.Selected = true;

                _chklstSelectedButtons.Items.Add(li);
            }
        }

        #endregion

        public virtual void Save()
        {
            lock (m_locker)
            {
                _preValues.SelectedButtons = GetCheckBoxSelections(_chklstSelectedButtons);
                _preValues.ContextMenu = GetCheckBoxChecked(_chkEnableRightClick);
                _preValues.RichTextEditorStylesheet = GetCheckBoxSelections(_chklstStylesheets);
                _preValues.BackEndScriptInclude = _txtBackEndScriptInclude.Text;
                _preValues.ProtectedPageUsername = _txtUsername.Text;
                _preValues.ProtectedPagePassword = _txtPassword.Text;

                int width = 0;
                int.TryParse(_txtWidth.Text, out width);
                _preValues.EditorWidth = width;

                int height = 0;
                int.TryParse(_txtHeight.Text, out height);
                _preValues.EditorHeight = height;

                int sourceNodeId = 0;
                int.TryParse(_txtBlockSourceNodeId.Text, out sourceNodeId);
                _preValues.BlockSourceNodeId = sourceNodeId;

                // Hack to set password text box value again as MS does not keep viewstate for password textboxes
                _txtPassword.Attributes.Add("value", _txtPassword.Text);
            }
        }

        public Control Editor
        {
            get { return this; }
        }
    }
}