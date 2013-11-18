$(document).ready(function () {
    var currentActiveContainer = null;
    var currentActiveBlock = null;

    var draggedEl;
    var dragging = false;

    $.get("/umbraco/dialogs/preview.aspx?id=" + currentNodeId, function (data) {
        data = data.replace("<body", "<body><div id='wbBackEnd'").replace("</body>", "</div></body>");
        var body = $(data).filter('#wbBackEnd');
        $(wbCanvas).fadeOut(200, function () {
            $(wbCanvas).html($(body).find(".wbLayout").html());
            $(wbCanvas).fadeIn(200, function () {
                var contextMenuOptions = {
                    livequery: false,
                    onSelect: function (e, context) {
                        var el = $(this);
                        var blockId = el.attr("rel");

                        if (el.hasClass('folder')) {
                            return false;
                        }

                        if (el.hasClass('wbAddWysiwygBlock') && hasAttr(currentActiveContainer, "dynamicWysiwygClass")) {
                            var newId = generateRandomNumber(10000, 52000);

                            if ($(".pageWysiwygBlock[wbid='" + newId + "']").length <= 0) {
                                var dynamicWysiwygClass = $(currentActiveContainer).attr("dynamicWysiwygClass");

                                $(currentActiveContainer).append("<div class='block pageWysiwygBlock wysiwygOff " + dynamicWysiwygClass + "' templateBlock='true' wbid='" + newId + "'></div>");
                                ($('#canvas .block')).jeegoocontext('wbBlockContextMenu', contextMenuOptions);
                            }
                        } else if (el.hasClass('wbAddWysiwygBlock') && !hasAttr(currentActiveContainer, "dynamicWysiwygClass")) {
                            $("#wysiwygNotAllowedDialog").dialog({
                                modal: true,
                                buttons: {
                                    Ok: function () {
                                        $(this).dialog("close");
                                    }
                                }
                            });
                        }

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

                ($('#canvas .block')).jeegoocontext('wbBlockContextMenu', contextMenuOptions);
                ($('#canvas .container')).jeegoocontext('wbContainerContextMenu', contextMenuOptions);

                $('#canvas .container').sortable({ revert: true });

                $('#canvas .block').live('mousedown', function (e) {
                    if (e.which == 3) {
                        currentActiveBlock = $(this);
                    }
                });
                $('#canvas .container').mousedown(function (e) {
                    if (e.which == 3) {
                        currentActiveContainer = $(this);
                    }
                });

                $('#canvas .block').live('dblclick', function () {
                    editBlock($(this));
                });

                $('#canvas .container').live('mouseover', function () {
                    if ($("#jstree-dragged", window.parent.document).is(":visible") && !dragging) {
                        $(this).addClass("containerHover");
                    }
                });
                $("#canvas .container").live("mouseout", function () {
                    $(this).removeClass("containerHover");
                });

                $('.pageWysiwygBlock').each(function (index, pageWysiwygBlock) {
                    if ($.trim($(pageWysiwygBlock).html()) == '') {
                        $(pageWysiwygBlock).addClass('wysiwygOff');
                    }
                });

                $('#canvas a').click(function (e) {
                    e.preventDefault();
                    return false;
                });

                $('#canvas button, #canvas input[type="submit"]').attr('disabled', 'disabled');

                $('#canvas form').live("submit", function (e) {
                    e.preventDefault();
                    return false;
                });

                $("#canvas input[type='text']").attr('unselectable', 'on').on('selectstart', false).attr("disabled", true);

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
                    var containerElement = $(this);

                    containerElement.removeClass("containerHover");

                    if (typeof (draggedEl) !== 'undefined') {
                        var id = draggedEl.attr('id');
                        $("#jstree-dragged", window.parent.document).remove();
                        draggedEl = undefined;

                        addBlock(id, containerElement);
                    }
                });

                $("form").submit(function () {
                    var containers = new Array();

                    $(".container").each(function () {
                        var container = new WebBlocks.Container();
                        container.Name = $(this).attr("wbid");

                        var sortOrder = 0;
                        $(this).find(".block").each(function () {
                            var block = null;

                            if ($(this).hasClass("pageWysiwygBlock")) {
                                block = new WebBlocks.WysiwygBlock();
                                block.Content = encodeURI($(this).html());
                            } else {
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

                if ($.browser.msie) {
                    $('form').submit(function (e) {
                        $('.block').each(function () {
                            var $this = $(this);
                            $this.remove();
                        });
                    });
                }

                var tinymceLoaded = false;

                var $tinymceDialog = $('#tinymce').dialog({
                    title: 'Edit WYSIWYG Content',
                    width: 730,
                    height: 580,
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
                            });
                        } else {
                            tinyMCE.activeEditor.setContent(currentActiveBlock.html());
                        }
                    },
                    close: function () {
                    }
                });

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

                $.get("/removepreviewcookie.ashx", function (data) {
                });

                function rerenderBlock(blockElement) {
                    var blockId = $(blockElement).attr("wbid");
                    var url = "/umbraco/surface/BlockRenderSurface/RenderBlock?pageId=" + currentNodeId + "&blockId=" + blockId;
                    $.get(url, function (data) {
                        $(wbCanvas + " .block[wbid='" + blockId + "']").each(function () {
                            $(this).html($(data).html());
                        });
                    });
                }

                function addBlock(blockId, containerElement) {
                    $.get("/base/WebBlocks/GetBlockDocType?id=" + blockId, function (data) {
                        var result = validateBlock(data, containerElement);

                        if (result.Valid) {
                            addBlockToContainer(blockId, containerElement);
                        } else {
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
                    });
                }

                function addBlockToContainer(blockId, containerElement) {
                    var url = "/umbraco/surface/BlockRenderSurface/RenderBlock?pageId=" + currentNodeId + "&blockId=" + blockId;
                    $.get(url, function (data) {
                        var blockContent = $(data);
                        $(blockContent).css("display", "none");
                        $(containerElement).append(blockContent);
                        $(blockContent).fadeIn(400);
                        ($('#canvas .block')).jeegoocontext('wbBlockContextMenu', contextMenuOptions);
                    });
                }

                function editBlock(blockElement) {
                    currentActiveBlock = blockElement;
                    if ($(blockElement).hasClass("pageWysiwygBlock") || $(blockElement).hasClass("wysiwygOff")) {
                        $tinymceDialog.dialog('open');
                    } else {
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

                function validateBlock(blockDocType, containerElement) {
                    var validResult = new WebBlocks.ContainerPermissionsResult();
                    if (hasAttr(containerElement, "allowedBlocks")) {
                        validResult.Type = "Allowed";
                        validResult.DocTypes = $(containerElement).attr("allowedBlocks").split(',');
                        validResult.Valid = $.inArray(blockDocType, validResult.DocTypes) != -1;
                    } else if (hasAttr(containerElement, "excludedBlocks")) {
                        validResult.Type = "Excluded";
                        validResult.DocTypes = $(containerElement).attr("excludedBlocks").split(',');
                        validResult.Valid = $.inArray(blockDocType, validResult.DocTypes) != -1;
                    } else {
                        validResult.Valid = true;
                    }
                    return validResult;
                }

                function hasAttrValue(element, attributeName, valueExpected) {
                    var attr = $(element).attr(attributeName);

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
                    } while(i < min && i > max);
                    return i;
                }
            });
        });
    });
});
