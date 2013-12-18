<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="WebBlocks.ascx.cs" Inherits="WebBlocks.DataTypes.WebBlocks.WebBlocks" %>

<asp:TextBox ID="txtLayoutJSON" runat="server" TextMode="MultiLine" style="display: none;"></asp:TextBox>
<asp:TextBox ID="txtPageHtml" runat="server" TextMode="MultiLine" style="display: none;"></asp:TextBox>

<link type="text/css" rel="stylesheet" href="<%= basePath %>/css/webblocks.css"/>
<link type="text/css" rel="stylesheet" href="<%= basePath %>/css/libraries/jquery-ui.custom.css"/>
<link type="text/css" rel="stylesheet" href="<%= basePath %>/css/libraries/jeegoocontext.css"/>
<link type="text/css" rel="stylesheet" href="/umbraco_client/Tree/treeIcons.css?cdv=2" />

<script type="text/javascript" src="<%= basePath %>/scripts/webblocks.models.js"></script>
<script type="text/javascript" src="<%= basePath %>/scripts/webblocks.js"></script>
<script type="text/javascript" src="<%= basePath %>/scripts/libraries/jquery.jeegoocontext.js"></script>

<asp:PlaceHolder runat="server" ID="plcBackEndScriptIncludes"></asp:PlaceHolder>

<div id="webBlocksWrapper">
    
    <!-- Tiny MCE -->
    <div id="tinymce" style="display: none;">
        <div></div>
        <div class="tinymceMenuBar" id="tinyMceWysiwygMenuBar"></div>
        <textarea name="tinyMceWysiwyg" id="tinyMceWysiwyg" rows="2" cols="20" class="tinymceContainer"></textarea>
    </div>
    <iframe id="editBlockIframe" style="display: none; width: 710px; height: 520px;"></iframe>


    <asp:PlaceHolder ID="plcContextMenu" runat="server">
        <ul id="wbContainerContextMenu" class="jeegoocontext cm_default">
            <li class="icon">
                <span class="icon folder"></span>
                Add Block
                <ul>
                    <asp:PlaceHolder ID="plcBlocksContextMenu" runat="server"></asp:PlaceHolder>
                </ul>
            </li>
            <li class="icon wbAddWysiwygBlock">
                <span class="icon" style="background: url('/umbraco/plugins/webblocks/images/wysiwyg.gif') no-repeat"></span>
                Add Wysiwyg Block
            </li>
        </ul>
        <ul id="wbBlockContextMenu" class="jeegoocontext cm_default">
           <li class="icon">
                <span class="icon folder"></span>
                Add Block
                <ul>
                    <asp:PlaceHolder ID="plcBlocksContextMenu2" runat="server"></asp:PlaceHolder>
                </ul>
            </li>
            <li class="icon wbAddWysiwygBlock">
                <span class="icon" style="background: url('/umbraco/plugins/webblocks/images/wysiwyg.gif') no-repeat"></span>
                Add Wysiwyg Block
            </li>
            <li class="icon" rel="edit">
                <span class="icon icon-edit"></span>
                Edit Block
            </li>
            <li class="icon" rel="delete">
                <span class="icon icon-delete"></span>
                Delete Block
            </li>
        </ul>
    </asp:PlaceHolder>

    <!-- Canvas -->
    <div id="outerCanvas">
      <div id="canvas">
        <div id="canvasRender" runat="server">
            <div class="wbLoadingBox">
                <img src="/umbraco/plugins/webblocks/images/logo.png" class="wbLogo"/>
                <img src="/umbraco/plugins/webblocks/images/loader.gif" class="wbLoader"/>
            </div>
        </div>
      </div>
    </div>

</div>

<div id="containerPermissionsDialog" title="Not Allowed" style="display:none;">
    <p>
        <span class="ui-icon webblocks-ui-icon-exclamation" style="float: left; margin: 3px 7px 50px 0;"></span>
        This block cannot be added to this container.
    </p>
    <p class="containerPermissionsMessage">
        
    </p>
</div>

<div id="wysiwygNotAllowedDialog" title="Not Allowed" style="display:none;">
    <p>
        <span class="ui-icon webblocks-ui-icon-exclamation" style="float: left; margin: 3px 7px 50px 0;"></span>
        Wysiwyg blocks cannot be added to this container.
    </p>
</div>


<!-- initialise tiny mce -->
<script type="text/javascript">
    //<![CDATA[
    function initTinyMCE(callback) {
        return tinyMCE.init({
            mode: "exact",
            theme: "umbraco",
            umbraco_path: "/umbraco",
            width: 700,
            height: 425,
            theme_umbraco_toolbar_location: "external",
            skin: "umbraco",
            inlinepopups_skin: "umbraco",
            plugins: "contextmenu,umbracomacro,umbracoembed,noneditable,inlinepopups,table,advlink,paste,spellchecker,umbracoimg,umbracocss,umbracopaste,umbracolink,umbracocontextmenu",
            umbraco_advancedMode: true,
            umbraco_maximumDefaultImageWidth: "500",
            language: "en",
            content_css: "<%= selectedRichTextCss %>",
            theme_umbraco_styles: "<%= selectedRichTextStyles %>",
            theme_umbraco_buttons1: "code,separator,undo,redo,cut,copy,pasteword,separator,umbracocss,separator,bold,italic,separator,justifyleft,justifycenter,justifyright,separator,bullist,numlist,outdent,indent,separator,link,unlink,anchor,separator,image,separator,charmap,table,umbracomacro",
            theme_umbraco_buttons2: "",
            theme_umbraco_buttons3: "",
            theme_umbraco_toolbar_align: "left",
            theme_umbraco_disable: "help,visualaid,strikethrough,removeformat,mcespellcheck,media,underline,subscript,justifyfull,inserthorizontalrule,superscript",
            theme_umbraco_path: true,
            extended_valid_elements: "div[*]",
            document_base_url: "/",
            relative_urls: false,
            remove_script_host: true,
            event_elements: "div",
            paste_auto_cleanup_on_paste: true,
            paste_remove_spans: true,
            valid_elements: '+a[id|style|rel|rev|charset|hreflang|dir|lang|tabindex|accesskey|type|name|href|target|title|class|onfocus|onblur|onclick|' +
            'ondblclick|onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|onkeydown|onkeyup],-strong/-b[class|style],-em/-i[class|style],' +
            '-strike[class|style],+param[id|src|name|value],+object[id|src|classid|width|height|align|type|data],-u[class|style],#p[id|style|dir|class|align],-ol[class|style],-ul[class|style],-li[class|style],br,' +
            'img[id|dir|lang|longdesc|usemap|style|class|src|onmouseover|onmouseout|border|alt=|title|hspace|vspace|width|height|align|umbracoorgwidth|umbracoorgheight|onresize|onresizestart|onresizeend|rel],' +
            '-sub[style|class],-sup[style|class],-blockquote[dir|style],-table[border=0|cellspacing|cellpadding|width|height|class|align|summary|style|dir|id|lang|bgcolor|background|bordercolor],' +
            '-tr[id|lang|dir|class|rowspan|width|height|align|valign|style|bgcolor|background|bordercolor],tbody[id|class],' +
            'thead[id|class],tfoot[id|class],-td[id|lang|dir|class|colspan|rowspan|width|height|align|valign|style|bgcolor|background|bordercolor|scope],' +
            '-th[id|lang|dir|class|colspan|rowspan|width|height|align|valign|style|scope],caption[id|lang|dir|class|style],-div[id|dir|class|align|style],' +
            '-span[class|align|style],-pre[class|align|style],address[class|align|style],-h1[id|dir|class|align],-h2[id|dir|class|align],' +
            '-h3[id|dir|class|align],-h4[id|dir|class|align],-h5[id|dir|class|align],-h6[id|style|dir|class|align],hr[class|style],' +
            'dd[id|class|title|style|dir|lang],dl[id|class|title|style|dir|lang],dt[id|class|title|style|dir|lang],object[classid|width|height|codebase|*],' +
            'param[name|value|_value],embed[type|width|height|src|*],map[name],area[shape|coords|href|alt|target],bdo,button',
            invalid_elements: 'font',
            spellchecker_rpc_url: 'GoogleSpellChecker.ashx',
            entity_encoding: 'raw',
            theme_umbraco_pageId: '<%= currentDocument.Id %>',
            theme_umbraco_versionId: '92aefc72-6274-453f-981b-9f15e1582c68',
            umbraco_toolbar_id: "tinyMceWysiwygMenuBar",
            elements: "tinyMceWysiwyg",
            oninit: callback
        });
    }
    //]]>
</script>
