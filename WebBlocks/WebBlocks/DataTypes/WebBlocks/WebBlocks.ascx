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
    <iframe id="editBlockIframe" style="display: none;"></iframe>


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
            width: <%= PreValueRepository.EditorWidth %>,
            height: <%= PreValueRepository.EditorHeight %>,
            theme_umbraco_toolbar_location: "external",
            skin: "umbraco",
            inlinepopups_skin: "umbraco",
            plugins: "<%= TinyMCEConfig.Plugins %>",
            umbraco_advancedMode: true,
            umbraco_maximumDefaultImageWidth: "500",
            language: "en",
            content_css: "<%= PreValueRepository.GetStyleStylesheetUrls()%>",
            theme_umbraco_styles: "<%= PreValueRepository.GetStylesheetStyles() %>",
            theme_umbraco_buttons1: "<%= PreValueRepository.GetSelectedButtonsWithSeparators() %>",
            theme_umbraco_buttons2: "",
            theme_umbraco_buttons3: "",
            theme_umbraco_toolbar_align: "left",
            theme_umbraco_disable: "",
            theme_umbraco_path: true,
            extended_valid_elements: "div[*]",
            document_base_url: "/",
            relative_urls: false,
            remove_script_host: true,
            event_elements: "div",
            paste_auto_cleanup_on_paste: true,
            paste_remove_spans: true,
            valid_elements: <%= TinyMCEConfig.ValidElements %>,
            invalid_elements: '<%= TinyMCEConfig.InvalidElements %>',
            theme_umbraco_pageId: '<%= currentDocument.Id %>',
            theme_umbraco_versionId: '92aefc72-6274-453f-981b-9f15e1582c68',
            umbraco_toolbar_id: "tinyMceWysiwygMenuBar",
            elements: "tinyMceWysiwyg",
            oninit: callback <%= TinyMCEConfig.ConfigOptions %>
        });
    }
    //]]>
</script>
