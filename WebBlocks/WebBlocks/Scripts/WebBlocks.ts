declare var tinyMCE: any;
declare var editorInstance: any;
declare var currentNodeId: number;
declare var wbCanvas: string;
declare function initTinyMCE(options: any): any;
declare var txtHiddenLayoutClientId: string;
declare var isProtectedPage: string;
declare var username: string;
declare var password: string;
declare var webBlocksGuid: string;


////////////////
// jQuery event bindings
////////////////
$(document).ready(function () {
    

    
    

    ensureLoggedInForProtectedPage(function () {
        $.ajax({
            type: 'GET',
            url: "/umbraco/dialogs/preview.aspx?id=" + currentNodeId + "&webBlocksGuid=" + webBlocksGuid,
            dataType: 'html',
            cache: false,
            error: function (jqXHR, textStatus, errorThrown) {
                $(wbCanvas).html(jqXHR.responseText);
            },
            success: function (data) {
                if (detectIE()) {
                    //IE doesnt rerequest previews - so we will request the preview manually after requesting the preview
                    $.ajax({
                        type: 'GET',
                        url: "/" + currentNodeId + ".aspx",
                        dataType: 'html',
                        cache: false,
                        success: function (data2) {
                            webBlocksApp(data2);
                        }
                    });
                }
                else {
                    webBlocksApp(data);
                }
            }
        });
    });
});


function webBlocksApp(data) {
    var currentActiveContainer = null;
    var currentActiveBlock = null;

    //dragging variables (drag and drop support)
    var draggedEl;
    var dragging = false;

    webBlocksLogOut();
    data = data.replace("<body", "<body><div id='wbBackEnd'").replace("</body>", "</div></body>");
    var body = $(data).filter('#wbBackEnd');
    $(wbCanvas).fadeOut(200, function () {
        $(wbCanvas).html($(body).find(".wbLayout").html());
        $(wbCanvas).fadeIn(200, function () {
            //context menu options (handle click event of context nodes)
            var contextMenuOptions = {
                livequery: false,
                onSelect: function (e, context) {

                    var el = $(this);
                    var blockId = el.attr("rel");

                    // Folders shouldn't do anything.. return false from here to prevent menu hiding
                    if (el.hasClass('folder')) {
                        return false;
                    }

                    //if the user clicked to add a new Wysiwyg block and the container is allowed to add them
                    if (el.hasClass('wbAddWysiwygBlock') && hasAttr(currentActiveContainer, "dynamicWysiwygClass")) {
                        var newId = generateRandomNumber(10000, 52000);
                        //as long as no other wysiwyg blocks have the same id
                        if ($(".pageWysiwygBlock[wbid='" + newId + "']").length <= 0) {
                            var dynamicWysiwygClass = $(currentActiveContainer).attr("dynamicWysiwygClass");
                            //add the wysiwyg block
                            $(currentActiveContainer).append("<div class='block pageWysiwygBlock wysiwygOff " + dynamicWysiwygClass + "' templateBlock='true' wbid='" + newId + "'></div>");
                            (<JeeGooContext>$('#canvas .block')).jeegoocontext('wbBlockContextMenu', contextMenuOptions);
                        }
                    }
                    else if (el.hasClass('wbAddWysiwygBlock') && !hasAttr(currentActiveContainer, "dynamicWysiwygClass")) {
                        $("#wysiwygNotAllowedDialog").dialog({
                            modal: true,
                            buttons: {
                                Ok: function () {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }

                    // Block items can be added to a container
                    if (el.hasClass('blockItem')) {
                        addBlock(blockId, currentActiveContainer);
                    }

                    switch (blockId) {
                        case 'delete':
                            deleteBlock(currentActiveBlock, currentActiveContainer);
                            break;
                        case 'edit':
                            editBlock(currentActiveBlock);
                            break;
                        case 'sort':
                            sortBlocks(currentActiveContainer);
                            break;
                    }
                }
            };

            // Context menu for block and container
            (<JeeGooContext>$('#canvas .block')).jeegoocontext('wbBlockContextMenu', contextMenuOptions);
            (<JeeGooContext>$('#canvas .container')).jeegoocontext('wbContainerContextMenu', contextMenuOptions);

            // Make container sortable elements
            $('#canvas .container').sortable({ revert: true });

            //event to detect which is the current active block
            $('#canvas .block').live('mousedown', function (e) {
                if (e.which == 3) {
                    currentActiveBlock = $(this);
                }
            });
            $('#canvas .container').mousedown(function (e) {
                // Capture the right click event
                if (e.which == 3) {
                    currentActiveContainer = $(this);
                }
            });

            //double click edit block event
            $('#canvas .block').live('dblclick', function () {
                editBlock($(this));
            });

            //events to highlight the container being hovered on
            $('#canvas .container').live('mouseover', function () {
                if ($("#jstree-dragged", window.parent.document).is(":visible") && !dragging) {
                    $(this).addClass("containerHover");
                }
            });
            $("#canvas .container").live("mouseout", function () {
                $(this).removeClass("containerHover");
            });

            // Go through all page wysiwyg blocks that are empty and update their class
            $('.pageWysiwygBlock').each(function (index, pageWysiwygBlock) {
                if ($.trim($(pageWysiwygBlock).html()) == '') {
                    $(pageWysiwygBlock).addClass('wysiwygOff');
                }
            });

            // Disable anchor clicks
            $('#canvas a').click(function (e) {
                e.preventDefault();
                return false;
            });
            // Disable submit buttons
            $('#canvas button, #canvas input[type="submit"]').attr('disabled', 'disabled');
            // Disable form submit events
            $('#canvas form').live("submit", function (e) {
                e.preventDefault();
                return false;
            });
            //disable input selected
            $("#canvas input[type='text']")
                .attr('unselectable', 'on')
                .on('selectstart', false)
                .attr("disabled", true);


            //////////////////////////////////////////
            // DRAGGING SUPPORT FOR UMBRACO
            //////////////////////////////////////////
            $('.tree.tree-umbraco li li', window.parent.document).delegate('a', 'mouseover', function (e) {
                $(this).draggable({
                    helper: 'clone',
                    iframeFix: true,
                    cursor: 'move'
                });
            });

            $('.tree.tree-umbraco li li', window.parent.document).delegate('a', 'mousedown', function (e) {
                if (e.which == 1) {
                    draggedEl = $(this).parent();
                    draggedEl.attr('rel', 'dataNode');
                }
            });

            $('#canvas .container').live('mouseover', function () {
                if ($("#jstree-dragged", window.parent.document).is(":visible") && !dragging) {
                    $(this).addClass("containerHover");
                }
            });

            $("#canvas .container").live("mouseout", function () {
                $(this).removeClass("containerHover");
            });

            $("#canvas .container").live("mouseup", function () {

                // Put this element into local scope
                var containerElement = $(this);

                containerElement.removeClass("containerHover");

                if (typeof (draggedEl) !== 'undefined') {
                    var id = draggedEl.attr('id');
                    $("#jstree-dragged", window.parent.document).remove();
                    draggedEl = undefined;

                    addBlock(id, containerElement);
                }
            });
            //////////////////////////////////////////
            // END OF DRAGGING SUPPORT FOR UMBRACO
            //////////////////////////////////////////


            //prepare for save
            $("form").submit(function () {
                var containers = new Array<WebBlocks.Container>();

                $(".container").each(function () {
                    var container = new WebBlocks.Container();
                    container.Name = $(this).attr("wbid");

                    var sortOrder = 0;
                    $(this).find(".block").each(function () {
                        var block = null;

                        if ($(this).hasClass("pageWysiwygBlock")) {
                            block = new WebBlocks.WysiwygBlock();
                            block.Content = encodeURIComponent($(this).html());
                            block.Content = block.Content.replace('+', '%2B');
                        }
                        else {
                            block = new WebBlocks.NodeBlock();
                        }

                        block.Id = $(this).attr("wbid");
                        block.SortOrder = sortOrder;
                        block.IsTemplateBlock = hasAttrValue($(this), "templateBlock", "true");
                        block.IsDeleted = hasAttrValue($(this), "deletedBlock", "deleted");

                        container.Blocks.push(block);
                        sortOrder++;
                    });

                    containers.push(container);
                });

                $("#" + txtHiddenLayoutClientId).val(JSON.stringify(containers));
            });

            //IE FIX
            if ($.browser.msie) {
                $('form').submit(function (e) {
                    $('.block').each(function () {
                        var $this = $(this);
                        $this.remove();
                    });
                });
            }

            var tinymceLoaded = false;

            //////////
            //  INSTANTIATE DIALOGS
            /////////

            // Instantiate the tinymce dialog
            var $tinymceDialog = $('#tinymce').dialog({
                title: 'Edit WYSIWYG Content',
                width: 'auto',
                height: 'auto',
                closeOnEscape: true,
                autoOpen: false,
                buttons: {
                    'Save': function () {
                        if (typeof (tinyMCE.activeEditor) !== 'undefined' && tinyMCE.activeEditor != null) {
                            var content = tinyMCE.activeEditor.getContent();
                            currentActiveBlock.html(content);
                            if (content !== '') {
                                currentActiveBlock.removeClass('wysiwygOff');
                            } else {
                                currentActiveBlock.addClass('wysiwygOff');
                            }
                        }
                        $(this).dialog('close');
                    },
                    'Cancel': function () {
                        tinyMCE.activeEditor.setContent(currentActiveBlock.html());
                        $(this).dialog('close');
                    }
                },
                open: function (content) {
                    if (!tinymceLoaded) {
                        editorInstance = initTinyMCE(function () {
                            tinyMCE.activeEditor.focus();
                            $('#tinyMceWysiwygMenuBar').show();
                            $('.mceToolbarExternal').show();
                            tinymceLoaded = true;
                            tinyMCE.activeEditor.setContent(currentActiveBlock.html());
                            $tinymceDialog.dialog({ position: "center" });
                        });
                    }
                    else {
                        tinyMCE.activeEditor.setContent(currentActiveBlock.html());
                    }

                },
                close: function () {
                    //tinyMCE.EditorManager.execCommand('mceRemoveControl', true, 'tinymce');
                }
            });

            // Instantiate the edit block iframe for other types of nodes
            var $editBlockIframeDialog = $('#editBlockIframe').dialog({
                title: 'Edit Block',
                width: 800,
                height: 560,
                closeOnEscape: true,
                autoOpen: false,
                buttons: {
                    'Finished': function () {
                        rerenderBlock(currentActiveBlock);
                        $(this).dialog('close');
                    }
                }
            });

            //remove preview cookie
            $.get("/removepreviewcookie.ashx", function (data) { });

            function rerenderBlock(blockElement) {
                var blockId = $(blockElement).attr("wbid");
                var url = "/umbraco/surface/BlockRenderSurface/RenderBlock?pageId=" + currentNodeId + "&blockId=" + blockId;
                $.ajax({
                    type: 'GET',
                    url: url,
                    dataType: 'html',
                    cache: false,
                    success: function (data) {
                        $(wbCanvas + " .block[wbid='" + blockId + "']").each(function () {
                            $(this).html($(data).html());
                            $(this).find("a").click(function (e) { e.preventDefault(); return false; });
                        });
                    }
                });
            }

            function addBlock(blockId, containerElement) {
                //validate the block - get the block doc type
                $.ajax({
                    type: 'GET',
                    url: "/base/WebBlocks/GetBlockDocType?id=" + blockId,
                    dataType: 'html',
                    cache: false,
                    success: function (data) {
                        //get whether it is valid
                        var result = validateBlock(data, containerElement);

                        //if its a valid block
                        if (result.Valid) {
                            //add the block
                            addBlockToContainer(blockId, containerElement);
                        }
                        else {
                            //show the appropriate error message
                            var message = result.Type == "Allowed" ? "The following blocks are allowed:<br/>" : "The following blocks are not allowed:<br/>";

                            for (var i = 0; i < result.DocTypes.length; i++) {
                                message += result.DocTypes[i] + ",";
                            }

                            message = message.substring(0, message.length - 1);

                            $("#containerPermissionsDialog .containerPermissionsMessage").html(message);
                            $("#containerPermissionsDialog").dialog({
                                modal: true,
                                buttons: {
                                    Ok: function () {
                                        $(this).dialog("close");
                                    }
                                }
                            });
                        }
                    }
                });
            }

            function addBlockToContainer(blockId, containerElement) {
                var url = "/umbraco/surface/BlockRenderSurface/RenderBlock?pageId=" + currentNodeId + "&blockId=" + blockId;
                $.ajax({
                    type: 'GET',
                    url: url,
                    dataType: 'html',
                    cache: false,
                    success: function (data) {
                        var blockContent = $(data);
                        $(blockContent).css("display", "none");
                        $(containerElement).append(blockContent);
                        $(blockContent).fadeIn(400);
                        (<JeeGooContext>$('#canvas .block')).jeegoocontext('wbBlockContextMenu', contextMenuOptions);
                    }
                });
            }

            function editBlock(blockElement) {
                currentActiveBlock = blockElement;
                if ($(blockElement).hasClass("pageWysiwygBlock") || $(blockElement).hasClass("wysiwygOff")) {
                    $tinymceDialog.dialog('open');
                }
                else {
                    $('#editBlockIframe').attr('src', '/umbraco/editContent.aspx?id=' + currentActiveBlock.attr("wbid"));
                    $editBlockIframeDialog.dialog('open');
                    $('#editBlockIframe').css({ width: 770, height: 500 });
                }
            }

            function deleteBlock(blockElement, containerElement) {
                $(blockElement).effect("shake", { times: 4, distance: 6 }, 50, function () {
                    $(blockElement).effect("explode", { pieces: 25 }, 600, function () {
                        $(blockElement).hide();
                        if (hasAttrValue(blockElement, "templateBlock", "true"))
                            $(blockElement).attr("deletedBlock", "deleted");
                        else
                            $(blockElement).remove();
                    });
                });
            }

            function sortBlocks(containerElement) {

            }

            function validateBlock(blockDocType, containerElement): WebBlocks.ContainerPermissionsResult {
                var validResult = new WebBlocks.ContainerPermissionsResult();
                if (hasAttr(containerElement, "allowedBlocks")) {
                    validResult.Type = "Allowed";
                    validResult.DocTypes = $(containerElement).attr("allowedBlocks").split(',');
                    validResult.Valid = $.inArray(blockDocType, validResult.DocTypes) != -1;
                }
                else if (hasAttr(containerElement, "excludedBlocks")) {
                    validResult.Type = "Excluded";
                    validResult.DocTypes = $(containerElement).attr("excludedBlocks").split(',');
                    validResult.Valid = $.inArray(blockDocType, validResult.DocTypes) != -1;
                }
                else {
                    validResult.Valid = true;
                }
                return validResult;
            }

            function hasAttrValue(element, attributeName, valueExpected) {
                var attr = $(element).attr(attributeName);
                //some older browsers return false
                if (typeof attr !== 'undefined' && attr !== false) {
                    return attr == valueExpected;
                }
                return false;
            }

            function hasAttr(element, attributeName) {
                var attr = $(element).attr(attributeName);
                return typeof attr !== 'undefined' && attr !== false;
            }

            function generateRandomNumber(min, max) {
                var i = 0;
                do {
                    i = Math.floor((Math.random() * max) + 1);
                } while (i < min && i > max);
                return i;
            }
        });
    });
}


function ensureLoggedInForProtectedPage(callback)
{
    if (isProtectedPage)
        $.post("/WebBlocksProtectedPage.ashx", { command: "signin", username: username, password: password }, function () {
            callback();
        });
    else
        callback();
}

function webBlocksLogOut() {
    try {
        $.post("/WebBlocksProtectedPage.ashx", { command: "signout" });
    }
    catch(ex){

    }
   
}

function detectIE() : boolean {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');

    // other browser
    return msie > 0 || trident > 0;
}