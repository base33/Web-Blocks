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
using WebBlocks.Helpers;

namespace WebBlocks.DataTypes.WebBlocks
{
    public partial class WebBlocks : System.Web.UI.UserControl, umbraco.editorControls.userControlGrapper.IUsercontrolDataEditor
    {
        #region protected properties
        protected int pageId = int.Parse(HttpContext.Current.Request.QueryString["id"]);
        protected Document currentDocument;
        protected IContent currentContent;

        protected string basePath = "/umbraco/plugins/webblocks";

        #endregion

        #region public properties
        public WebBlocksPreValueRepository PreValueRepository { get; set; }
        public WebBlocksTinyMCEConfiguration TinyMCEConfig { get; set; }

        public object value
        {
            get
            {
                string json = txtLayoutJSON.Text;
                //json = LocalLinkHelper.ResolveLocalLinks(json);
                txtLayoutJSON.Text = json;
                return txtLayoutJSON.Text;
            }
            set
            {
                if (!IsPostBack)
                    txtLayoutJSON.Text = value as string;
            }
        }
        #endregion

        protected void Page_Load(object sender, EventArgs e)
        {
            TinyMCEConfig = new WebBlocksTinyMCEConfiguration();

            currentDocument = new Document(pageId);

            currentContent = UmbracoContext.Current.Application.Services.ContentService.GetById(pageId);
            RenderBlockContextMenu();
            RenderScripts();

            if (IsPostBack)
            {
                txtLayoutJSON.Text = HtmlImgHelper.ResizeImages(txtLayoutJSON.Text);
            }
        }

        public void RenderBlockContextMenu()
        {
            int blockSourceNodeId = PreValueRepository.BlockSourceNodeId;
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
            sb.AppendFormat("var wbBlockSourceNodeId = '{0}';", PreValueRepository.BlockSourceNodeId);
            sb.Append("var wbServiceUrl = '/base/webblocks';");
            sb.AppendFormat("var txtHiddenLayoutClientId = '{0}';", txtLayoutJSON.ClientID);
            sb.AppendFormat("var plcCotnfextMenuClientId = '{0}';", plcContextMenu.ClientID);
            sb.AppendFormat("var wbCanvas = '#{0}';", canvasRender.ClientID);
            sb.AppendFormat("var isProtectedPage = {0};", umbraco.library.IsProtected(currentDocument.Id, currentDocument.Path) ? "true" : "false");
            sb.AppendFormat("var username = '{0}';", PreValueRepository.ProtectedPageUsername);
            sb.AppendFormat("var password = '{0}';", PreValueRepository.ProtectedPagePassword);
            sb.AppendFormat("var webBlocksGuid = '{0}';", Guid.NewGuid());
            cs.RegisterStartupScript(GetType(), "WebBlocks", sb.ToString(), true);

            plcBackEndScriptIncludes.Controls.Add(new Literal() { Text = HttpUtility.UrlDecode(PreValueRepository.BackEndScriptInclude) });
        }
    }
}