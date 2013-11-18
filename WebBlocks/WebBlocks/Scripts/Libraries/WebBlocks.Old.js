/****
Mentor Web Blocks for Umbraco
Copyright (C) 2013 Mentor Digital 
(Mentor Communications Consultancy Ltd, 4 West End, Somerset Street, Bristol, BS2 8NE)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****/

// Global vars belonging to layout builder
//
//  - wbCurrentNodeId (Node id of the current page)
//  - wbServiceUrl (url to the base service)
//  - txtHiddenLayoutClientId (client id of the hidden layout textbox for storing serialized representation)

// Instantiate the web blocks main namespace.
WebBlocks = Class.extend({});

// Models namespace.
WebBlocks.Models = Class.extend({});

// Block model client-side representation
WebBlocks.Models.Block = Class.extend({

    init: function (nodeId, sortOrder) {
        this.NodeId = nodeId || 0;
        this.SortOrder = sortOrder || 0;
        this.DisplayName = '';
        this.Alias = '';
        this.BlockType = '';
        this.Content = '';
        this.Columns = 0;
        this.Predefined = false;
        this.Deleted = false;
    },

    setColumns: function (columns) {
        this.Columns = columns;
    },

    setSortOrder: function (sortOrder) {
        this.SortOrder = sortOrder;
    },

    setBlockType: function (blockType) {
        this.BlockType = blockType;
    },

    setContent: function (content) {
        this.Content = content;
    },

    setContainer: function (container) {
        this.Container = container;
    },

    setPredefined: function (predefined) {
        this.Predefined = predefined;
    },

    setDeleted: function (deleted) {
        this.Deleted = deleted;
    },

    setAlias: function (alias) {
        this.Alias = alias;
    },

    setDisplayName: function (displayName) {
        this.DisplayName = displayName;
    },

    getNodeId: function () {
        return this.NodeId;
    },

    getDisplayName: function () {
        return this.DisplayName;
    },

    getAlias: function () {
        return this.Alias;
    },

    getColumns: function () {
        return this.Columns;
    },

    getSortOrder: function () {
        return this.SortOrder;
    },

    getType: function () {
        return this.BlockType;
    },

    getContent: function () {
        return this.Content;
    }
});

// Container model client-side representation.
WebBlocks.Models.Container = Class.extend({

    init: function (alias) {
        this.Id = alias;
        this.Blocks = [];
    },

    addBlock: function (block) {
        this.Blocks.push(block);
    },

    // Note: Completely overwrites existing blocks!
    setBlocks: function (blocks) {
        this.Blocks = blocks;
    },

    getBlocks: function () {
        return this.Blocks;
    },

    getBlockAtIndex: function (index) {
        return this.Blocks[index];
    },

    getBlockByNodeId: function (nodeId) {
        var block = undefined;
        for (var i = 0; i < this.Blocks.length; i++) {
            if (this.Blocks[i].NodeId == nodeId) {
                block = this.Blocks[i];
                break;
            }
        }
        return block;
    }
});

$(document).ready(function () {

    function rerenderBlock(id, blockElement) {
        $.get(wbServiceUrl + '/RenderBlock/' + id + '?id=' + wbCurrentNodeId, function (data) {
            if (data.indexOf('Exception') != 0) {
                var domElement = $('<div>' + data + '</div>');
                var tempBlock = $(domElement).find(".block");
                $(tempBlock).find("input[type='submit']").attr("disabled", "disabled");
                $(tempBlock).find("a").attr("href", "#");
                //add a dragable area for when users drag on an object element such a youtube embed
                addDragableIfFlashBlock(tempBlock);
                tempBlock.jeegoocontext('wbBlockContextMenu', contextMenuOptions);
                blockElement.html(tempBlock.html());
            } else {
                //output the message
                alert(data.replace("Exception:", ""));
            }

        });

    }

    function addBlockToContainer(id, containerElement) {

        $.get(wbServiceUrl + '/RenderBlock/' + id + '?id=' + wbCurrentNodeId, function (data) {
            //if there was not exception thrown (e.g. MacroNotFoundException)
            if (data.indexOf("Exception") != 0) {
                // Instantiate and setup a block division element
                var domElement = $('<div>' + data + '</div>');
                //domElement.addClass('block');

                var blockElement = $(domElement).find(".block");
                $(blockElement).find("input[type='submit']").attr("disabled", "disabled");
                $(blockElement).find("a").attr("href", "#");

                //add a dragable area for when users drag on an object element such a youtube embed
                addDragableIfFlashBlock(blockElement);

                blockElement.jeegoocontext('wbBlockContextMenu', contextMenuOptions);
                containerElement.append(blockElement);

                // Scroll down to where the new block was added
                var pos = blockElement.offset();
                $('body').animate({ scrollTop: pos.top });

                // Fetch the corresponding model for this container element
                var containerModel = containerElement.data('containerModel');
                var block = new WebBlocks.Models.Block(parseInt(id));
                block.setSortOrder($('.block', containerElement).length - 1);

                block.setDisplayName(id.toString());
                block.setAlias(id.toString());
                // Dragged blocks are always non pre-defined. 
                block.setPredefined(false);

                blockElement.data('blockModel', block);
                containerModel.addBlock(block);
            }
            else {
                //output the message
                alert(data.replace("Exception:", ""));
            }
        });
    }

    function editBlock(blockElement) {
        // Get the block element's model
        var blockModel = blockElement.data('blockModel');
        currentlyActiveBlock = blockElement;

        if (blockModel.getNodeId() == 0) {
            // Show a dialog box with the wysiwyg content.
            $tinymceDialog.dialog('open');
        } else {
            $('#editBlockIframe').attr('src', '/umbraco/editContent.aspx?id=' + blockModel.getNodeId());
            $editBlockIframeDialog.dialog('open');

            $('#editBlockIframe').css({ width: 700, height: 500 });
        }
    }

    function deleteBlock(blockElement, containerElement) {

        if (confirm('Are you sure you want to delete this block? Changes only take effect after saving the page.')) {

            var block = blockElement.data('blockModel');
            var container = containerElement.data('containerModel');
            var blocks = container.getBlocks();

            // If the block is predefined we just need to set it's deleted flag
            // rather than permanently remove it. This is because we can't remove
            // blocks from the synchronised templates.
            for (var i = 0; i < blocks.length; i++) {
                if (blocks[i].NodeId == block.NodeId) {
                    if (block.Predefined) {
                        blocks[i].Deleted = true;
                    } else {
                        blocks.splice(i, 1);
                    }
                    break;
                }
            }

            // Always remove the element though regardless of whether its predefined
            // or not.
            blockElement.remove();
        }
    }

    function addDragableIfFlashBlock(blockElement) {
        //add a dragable area for when users drag on an object element such a youtube embed
        //block is not draggable without this
        var html = $(blockElement).html();
        if (html != null && html.toLowerCase().indexOf("<object") >= 0)
            $(blockElement).prepend($("<div style='background:#F7F7F7;color:black;'>&nbsp;:: Flash Content - Drag Here</div>"));
    }

    var containers = [];
    var serializedContainers = $('#' + txtHiddenLayoutClientId).val();
    var currentlyActiveContainer;
    var currentlyActiveBlock;
    var contextMenuOptions = {
        livequery: false,
        onSelect: function (e, context) {

            var el = $(this);
            var rel = el.attr("rel");

            // Folders shouldn't do anything.. return false from here to prevent menu hiding
            if (el.hasClass('folder')) {
                return false;
            }

            // Block items can be added to a container
            if (el.hasClass('blockItem')) {
                addBlockToContainer(rel, currentlyActiveContainer);
            }

            switch (rel) {
                case 'delete':
                    deleteBlock(currentlyActiveBlock, currentlyActiveContainer);
                    break;
                case 'edit':
                    editBlock(currentlyActiveBlock);
                    break;
                case 'sort':
                    sortBlocks(currentlyActiveContainer);
                    break;
            }
        }
    };

    // Loop through each container element and synchronise a container model with it
    if (serializedContainers == '""' || serializedContainers == '' || serializedContainers == '[]') {
        $('.container').each(function () {
            var containerElement = $(this);

            // The rel attribute of the container should be the alias.
            var containerAlias = containerElement.attr('rel');
            var container = new WebBlocks.Models.Container(containerAlias);

            containers.push(container);

            containerElement.data('containerModel', container);

            var c = 0;

            $('.block', containerElement).each(function (index, value) {
                var blockElement = $(this);
                var id = blockElement.attr('rel');
                var blockModel = new WebBlocks.Models.Block(id);

                blockModel.setPredefined(true);
                blockModel.setDeleted(false);
                blockModel.setSortOrder(c++);

                container.addBlock(blockModel);

                addDragableIfFlashBlock(blockElement);

                $(document).trigger('wbAddBlockToContainer', [blockElement, containerElement]);

                blockElement.data('blockModel', blockModel);
            });
        });
    } else {
        // Otherwise parse the serialized containers
        // and then find associated elements.
        var tmpContainers = JSON.parse(serializedContainers);

        for (var i = 0; i < tmpContainers.length; i++) {
            var containerElement = $('.container[rel="' + tmpContainers[i].Id + '"]');

            if (containerElement.length) {

                var containerModel = new WebBlocks.Models.Container(tmpContainers[i].Id);

                for (var bi = 0; bi < tmpContainers[i].Blocks.length; bi++) {

                    var tmpBlock = tmpContainers[i].Blocks[bi];
                    var blockModel = new WebBlocks.Models.Block(tmpBlock.NodeId);

                    blockModel.setPredefined(tmpBlock.Predefined);
                    blockModel.setDeleted(tmpBlock.Deleted);
                    blockModel.setAlias(tmpBlock.Alias);
                    blockModel.setDisplayName(tmpBlock.DisplayName);
                    blockModel.setSortOrder(tmpBlock.SortOrder);
                    blockModel.setBlockType(tmpBlock.BlockType);
                    blockModel.setContent(tmpBlock.Content);

                    var blockElement = $('.block[rel="' + blockModel.NodeId + '"]');

                    if (blockElement != null && blockElement.length) {
                        blockElement.data('blockModel', blockModel);
                        containerModel.addBlock(blockModel);
                        addDragableIfFlashBlock(blockElement);
                    }

                    //$(document).trigger('wbAddBlockToContainer', [blockElement, containerElement]);
                }

                containerElement.data('containerModel', containerModel);

                containers.push(containerModel);
            }
        }

        // Still synchronise existing blocks to the model to accommodate
        // for deletion of template blocks from the template itself.
        $('.container').each(function () {
            var containerElement = $(this);
            var containerModel = containerElement.data('containerModel');

            if (typeof (containerModel) === 'undefined') {
                containerModel = new WebBlocks.Models.Container(containerElement.attr('rel'));
                containerElement.data('containerModel', containerModel);
                containers.push(containerModel);
            }

            var currentIndex = $('.block', containerElement).length - 1;

            $('.block', containerElement).each(function (index, value) {
                var blockElement = $(this);
                var id = parseInt(blockElement.attr('rel'));
                var existingBlock = containerModel.getBlockByNodeId(id);

                if (typeof (existingBlock) === 'undefined') {
                    var block = new WebBlocks.Models.Block(id);

                    // Predefined will always be true as we know it's come
                    // from the template.
                    block.setDeleted(false);
                    block.setPredefined(true);
                    block.setContent('');
                    block.setSortOrder(currentIndex++);

                    blockElement.data('blockModel', block);

                    containerModel.addBlock(block);
                    $(document).trigger('wbAddBlockToContainer', [blockElement, containerElement]);
                }
            });
        });
    }

    serializedContainers = JSON.stringify(containers);
    $('#' + txtHiddenLayoutClientId).val(serializedContainers);

    $('form').submit(function () {
        serializedContainers = JSON.stringify(containers);
        $('#' + txtHiddenLayoutClientId).val(serializedContainers);
    });

    // IE viewstate bug fix
    // http://stackoverflow.com/questions/8946374/the-state-information-is-invalid-for-this-page-and-might-be-corrupted-only-in

    if ($.browser.msie) {
        // var formSubmitted = false;

        $('form').submit(function (e) {
            //if (!formSubmitted) {
            //e.preventDefault();
            //clearInterval(serializeIntervalId); //removed with setInterval
            $('.block').each(function () {
                var $this = $(this);
                $this.remove();
            });
            //formSubmitted = true;
            //$('form').trigger('submit', [e]);
            //}
        });
    }

    $('#canvas .block').live('mousedown', function (e) {
        if (e.which == 3) {
            currentlyActiveBlock = $(this);
        }
    });

    $('#canvas .container').mousedown(function (e) {
        // Capture the right click event
        if (e.which == 3) {
            currentlyActiveContainer = $(this);
        }
    });

    $('#canvas .block').jeegoocontext('wbBlockContextMenu', contextMenuOptions);

    // Convert the source node lists into a context menu
    $('#canvas .container').jeegoocontext('wbContainerContextMenu', contextMenuOptions);

    // Drag and drop support from left hand umbraco menu
    var draggedEl;
    var dragging = false;

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
            addBlockToContainer(id, containerElement);
            $("#jstree-dragged", window.parent.document).remove();
            draggedEl = undefined;
        }
    });

    $('#canvas .block').live('dblclick', function () {
        editBlock($(this));
    });

    // Disable anchor clicks
    $('#canvas a').click(function (e) {
        e.preventDefault();
        return false;
    });

    $('#canvas button, #canvas input[type="submit"]').attr('disabled', 'disabled');

    // Disable form submissions
    $('#canvas form').submit(function (e) {
        e.preventDefault();
        return false;
    });

    // Make container sortable elements
    $('#canvas .container').sortable({
        revert: true,
        update: function () {
            var containerElement = $(this);
            console.log(JSON.stringify(containers));
            // Loop through block element and check if it has
            // an associated block model.
            $('.block', containerElement).each(function (index, value) {
                var blockElement = $(this);
                var blockModel = blockElement.data('blockModel');

                if (typeof (blockModel) !== 'undefined') {
                    // If a block model exists the block can be sorted.
                    blockModel.setSortOrder(index);
                }
            });
        }
    });

    // Go through all page wysiwyg blocks that are empty and update their class
    $('.pageWysiwygBlock').each(function () {
        var el = $(this);
        var blockModel = el.data('blockModel');
        if ($.trim(blockModel.getContent()) == '') {
            el.addClass('wysiwygOff');
        } else {
            el.html(blockModel.getContent());
        }
    });


    var tinymceLoaded = false;

    // Instantiate the tinymce dialog
    var $tinymceDialog = $('#tinymce').dialog({
        title: 'Edit WYSIWYG Content',
        width: 730,
        height: 580,
        closeOnEscape: true,
        autoOpen: false,
        buttons: {
            'Save': function () {
                var blockElement = currentlyActiveBlock;
                var blockModel = blockElement.data('blockModel');
                if (typeof (tinyMCE.activeEditor) !== 'undefined' && tinyMCE.activeEditor != null) {
                    var content = tinyMCE.activeEditor.getContent();
                    blockModel.setContent(content);
                    blockElement.html(content);
                    if (content !== '') {
                        blockElement.removeClass('wysiwygOff');
                    } else {
                        blockElement.addClass('wysiwygOff');
                    }
                }
                $(this).dialog('close');
            },
            'Cancel': function () {
                var blockElement = currentlyActiveBlock;
                var blockModel = blockElement.data('blockModel');
                tinyMCE.activeEditor.setContent(blockModel.getContent());
                $(this).dialog('close');
            }
        },
        open: function () {
            if (!tinymceLoaded) {
                editorInstance = initTinyMCE(function () {
                    tinyMCE.activeEditor.setContent(blockModel.getContent());
                    tinyMCE.activeEditor.focus();
                    $('#tinyMceWysiwygMenuBar').show();
                    $('.mceToolbarExternal').show();
                    tinymceLoaded = true;
                });
            }
        },
        close: function () {
            //tinyMCE.EditorManager.execCommand('mceRemoveControl', true, 'tinymce');
        }
    });

    // Instantiate the edit block iframe for other types of nodes
    var $editBlockIframeDialog = $('#editBlockIframe').dialog({
        title: 'Edit Block',
        width: 730,
        height: 560,
        closeOnEscape: true,
        autoOpen: false,
        buttons: {
            'Finished': function () {
                var blockModel = currentlyActiveBlock.data('blockModel');
                rerenderBlock(blockModel.getNodeId(), currentlyActiveBlock);
                $(this).dialog('close');
            }
        }
    });
});