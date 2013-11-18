$(document).ready(function () {
    var currentActiveBlock = null;
    var tinymceLoaded = false;

    $('#wbBlockMenuDisplay').sidr({ displace: false });

    var draggedEl = undefined;
    var currentMousePos = { x: -1, y: -1 };

    $(document).on('mousemove', function (e) {
        currentMousePos.x = e.pageX;
        currentMousePos.y = e.pageY;
        if (draggedEl != undefined) {
            $('#wbDraggableEl').css({
                left: e.pageX,
                top: e.pageY + 25
            });
        }
    });

    $("a,input[type='submit'],button").live('click', function (e) {
        if ($(this).attr("id") != "wbExit") {
            e.preventDefault();
            return false;
        }
    });

    $(".sidr").hover(function () {
    }, function () {
        if (typeof (draggedEl) !== 'undefined') {
            $.sidr('close', 'sidr', function () {
                draggedEl.attr('rel', 'dataNode');

                $("body").append("<div id='wbDraggableEl' style='z-index:50000;position:absolute;background:black;color:white;top:0;left:0;padding:10px;'>Block</div>");
                $('#wbDraggableEl').css({
                    left: currentMousePos.x,
                    top: currentMousePos.y + 25
                });
            });
        }
    });

    $('.sidr li a').live('mousedown', function (e) {
        if ($(this).hasClass("wbCloseBlocksMenuButton"))
            return;

        draggedEl = $(this);

        $(this).draggable({
            helper: 'clone',
            cursor: 'move',
            speed: 1000,
            scroll: true
        });
    });

    $('.sidr li').live('mousedown', function (e) {
        return false;
    });

    $('.pageWysiwygBlock').each(function (index, pageWysiwygBlock) {
        if ($.trim($(pageWysiwygBlock).html()) == '') {
            $(pageWysiwygBlock).addClass('wysiwygOff');
        }
    });

    $("*").live("mouseup", function () {
        if (typeof (draggedEl) !== 'undefined' && ($(this).hasClass("container") || $(this).parents(".container").length > 0)) {
            var draggedParentEl = $(draggedEl).parent();
            var currentContainer = $(this).hasClass("container") ? $(this) : $(this).parents(".container");
            if ($(draggedParentEl).hasClass("wbAddWysiwygBlock")) {
                var newId = generateRandomNumber(10000, 52000);

                if ($(".pageWysiwygBlock[wbid='" + newId + "']").length <= 0) {
                    var dynamicWysiwygClass = $(currentContainer).attr("dynamicWysiwygClass");

                    $(currentContainer).append("<div class='block pageWysiwygBlock wysiwygOff " + dynamicWysiwygClass + "' templateBlock='true' wbid='" + newId + "'></div>");
                }
            } else {
                addBlock($(draggedEl).attr("wbid"), currentContainer);
            }
            $.sidr('open', 'sidr');
        }

        $("#wbDraggableEl").remove();
        draggedEl = undefined;
    });

    $(".container").sortable({ revert: true });

    $('.block').live('dblclick', function () {
        editBlock($(this));
    });

    $("#wbDelete").droppable({
        tolerance: "touch",
        accept: function () {
            return true;
        },
        drop: function (event, ui) {
            if ($(ui.draggable).hasClass("block")) {
                $(ui.draggable).css({ "z-index": 9999999 });

                deleteBlock(ui.draggable, $(ui.draggable).parents(".container"));
            }
        }
    });

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

    $("#wbSave").click(function () {
        var containers = BuildContainerArray();

        $.post("/base/WebBlocks/SaveWebBlocks?pageId=" + currentNodeId, {
            wbJSON: JSON.stringify(containers)
        }, function (data) {
            alert("Success");
        });
    });

    $("#wbSaveAndPublish").click(function () {
        var containers = BuildContainerArray();

        $.post("/base/WebBlocks/SaveAndPublishWebBlocks?pageId=" + currentNodeId, {
            wbJSON: JSON.stringify(containers)
        }, function (data) {
            alert("Success");
        });
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
        $(blockElement).hide();
        if (hasAttrValue(blockElement, "templateBlock", "true"))
            $(blockElement).attr("deletedBlock", "deleted");
else
            $(blockElement).remove();
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

    function BuildContainerArray() {
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
        return containers;
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
