using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using WebBlocks.Utilities.WebBlocks;
using umbraco.BusinessLogic;
using umbraco.cms.businesslogic.web;
using umbraco.NodeFactory;
using WebBlocks.Utilities.Cache;
using WebBlocks.Utilities.Umbraco;
using Umbraco.Web;
using Umbraco.Core.Models;
using umbraco;
using System.Net;
using System.IO;
using umbraco.presentation.preview;

namespace WebBlocks.DataTypes.WebBlocks
{
    public partial class WebBlocks : System.Web.UI.UserControl, umbraco.editorControls.userControlGrapper.IUsercontrolDataEditor
    {
        #region protected properties
        protected int pageId = int.Parse(HttpContext.Current.Request.QueryString["id"]);
        protected Document currentDocument;
        protected IContent currentContent;

        protected string basePath = "/umbraco/plugins/webblocks";

        // tiny mce properties
        protected string selectedRichTextCss = "";
        protected string selectedRichTextStyles = "";
        #endregion

        #region public properties
        public WebBlocksPreValuesAccessor PreValueAccessor { get; set; }

        public object value
        {
            get
            {
                string json = txtLayoutJSON.Text;
                json = LocalLinkHelper.ResolveLocalLinks(json);
                txtLayoutJSON.Text = json;
                return txtLayoutJSON.Text;
            }
            set
            {
                if(!IsPostBack)
                    txtLayoutJSON.Text = value as string;
            }
        }
        #endregion

        protected void Page_Load(object sender, EventArgs e)
        {
            currentDocument = new Document(pageId);

            currentContent = UmbracoContext.Current.Application.Services.ContentService.GetById(pageId);
            LoadRichTextEditorStyles();
            RenderBlockContextMenu();
            RenderScripts();
        }

        public void RenderBlockContextMenu()
        {
            int blockSourceNodeId = PreValueAccessor.BlockSourceNodeId;
            IconProvider iconProvider = new IconProvider();
            try
            {
                var blocksSourceNode = new Node(blockSourceNodeId);
                var sb = new StringBuilder();

                // Loop through each children and output accordingly.
                foreach (Node child in blocksSourceNode.Children)
                {
                    RenderBlockSubList(child, sb, iconProvider);
                }

                plcBlocksContextMenu.Controls.Add(new LiteralControl(sb.ToString()));
                plcBlocksContextMenu2.Controls.Add(new LiteralControl(sb.ToString()));
            }
            catch { }
        }

        public void RenderBlockSubList(Node node, StringBuilder sb, IconProvider iconProvider)
        {
            string icon = iconProvider[node.NodeTypeAlias];
            sb.AppendFormat("<li class='icon {0}' rel='{1}'><span class='icon{2}' style='background:url(\"{3}{4}\") no-repeat;'></span>{5}",
                node.NodeTypeAlias == "BlocksFolder" ? "folder" : "blockItem",
                node.Id,
                icon.StartsWith(".") ? " " + icon.TrimStart('.') : "",
                icon.StartsWith(".") ? "/umbraco/images/umbraco/sprites.png" : "/umbraco/images/umbraco/",
                !icon.StartsWith(".") ? icon : "",
                node.Name);
            if (node.Children.Count > 0)
            {
                sb.Append("<ul>");
                foreach (Node child in node.Children)
                {
                    RenderBlockSubList(child, sb, iconProvider);
                }
                sb.Append("</ul>");
            }
            sb.Append("</li>");
        }

        public void RenderScripts()
        {
            ClientScriptManager cs = Page.ClientScript;

            if (currentDocument != null && currentDocument.Id > 0 &&
                !currentDocument.GenericProperties.Any(p => p.Id == -87 || p.PropertyType.Name.Contains("Richtext editor")))
            {
                cs.RegisterClientScriptInclude("tinyMceCompress", "/umbraco/plugins/tinymce3/tinymce3tinymceCompress.aspx?themes=umbraco&plugins=contextmenu,umbracomacro,noneditable,inlinepopups,table,advlink,media,paste,spellchecker,umbracoimg,umbracocss&languages=en");
            }


            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("var currentNodeId = '{0}';", currentDocument.Id);
            sb.AppendFormat("var wbBlockSourceNodeId = '{0}';", PreValueAccessor.BlockSourceNodeId);
            sb.Append("var wbServiceUrl = '/base/webblocks';");
            sb.AppendFormat("var txtHiddenLayoutClientId = '{0}';", txtLayoutJSON.ClientID);
            sb.AppendFormat("var plcCotnfextMenuClientId = '{0}';", plcContextMenu.ClientID);
            sb.AppendFormat("var wbCanvas = '#{0}';", canvasRender.ClientID);
            cs.RegisterStartupScript(GetType(), "WebBlocks", sb.ToString(), true);

            plcBackEndScriptIncludes.Controls.Add(new Literal() { Text = PreValueAccessor.BackEndScriptIncludes });
        }

        protected void LoadRichTextEditorStyles()
        {
            string ids = PreValueAccessor.RichTextEditorStylesheet;

            if (ids != "")
            {
                string[] stylesheetIds = ids.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

                foreach (var stylesheet in stylesheetIds.Select(s => new StyleSheet(Convert.ToInt32(s))))
                {
                    selectedRichTextCss += string.Format("/css/{0}.css,", stylesheet.Text);

                    foreach (var style in stylesheet.Properties)
                    {
                        selectedRichTextStyles += string.Format("{0}={1};", style.Text, style.Alias);
                    }
                }

                selectedRichTextCss = selectedRichTextCss.TrimEnd(',');
                selectedRichTextStyles = selectedRichTextStyles.TrimEnd(',');
            }
        }
    }
}