angular.module("umbraco").filter("wbContainerName", function () {
    return function (containerName) {
        return containerName.replace("_", " ");
    };
});
angular.module("umbraco").controller("WebBlocks.LayoutBuilder", ["$scope", "$http", "$element", "appState", "contentResource", "editorState", "eventsService", "assetsService", "dialogService", "notificationsService", "$compile",
    function ($scope, $http, $element, appState, contentResource, editorState, eventsService, assetsService, dialogService, notificationsService, $compile) {
        //which loading screen to choose
        $scope.loadInCreateMode = window.location.hash.indexOf("create=true") > 0;
        //$scope.wysiwygEditorUrl = "/App_Plugins/WebBlocks/LayoutBuilder.WysiwygEditor.html";
        $scope.activeEditSessions = {};
        $scope.currentSortableDraggedBlock = 0; //allows us to cache the block that is being dragged.  This is required to prevent disallowed blocks from being dragged in.
        $scope.model.config.iframeHeight = $scope.model.config.iframeHeight == "" ? "400" : $scope.model.config.iframeHeight;
        $scope.model.config.iframeWidth = $scope.model.config.iframeWidth == "" ? "700" : $scope.model.config.iframeWidth;
        //need to keep types, and umbraco replaces typed models with plain json objects after saving.
        //The approach is to use the layoutBuilderModel to reference a working layout builder.  And $scope.model.value will be a clone.
        //When the working model is updated, we will clone it over to $scope.model.value
        //so first, I create a reference variable to use in the code.  This will be the working layout builder
        var layoutBuilderModel = null;
        $scope.loadLayoutBuilder = function () {
            //next I load/sync the layout builder
            $scope.layoutBuilderModel = loadLayoutBuilder(function () {
                //then I want to clone it into $scope.model.value
                $scope.model.value = angular.copy($scope.layoutBuilderModel);
                //set the reference variable
                layoutBuilderModel = $scope.layoutBuilderModel;
                //watch the layoutbuildermodel scope for changes and then update $scope.model.value
                $scope.$watch("layoutBuilderModel", function () {
                    //we will clone over
                    $scope.model.value = angular.copy(layoutBuilderModel);
                }, true);
            });
        };
        $scope.loadLayoutBuilder();
        $scope.rerenderLayoutBuilder = function () {
            if (confirm("Any unsaved changes will be lost.  Click 'OK' to continue or 'Cancel' to go back and save.")) {
                $scope.loadLayoutBuilder();
            }
        };
        //show navigation if you change tab
        //$scope.$watch(function () {
        //    return $scope.$parent.$parent.$parent.$parent.$parent.tab.active;
        //}, function () {
        //    alert($scope.$parent.$parent.$parent.$parent.$parent.tab.active);
        //    if (!$scope.$parent.$parent.$parent.$parent.$parent.tab.active) {
        //        appState.setGlobalState("showNavigation", true);
        //    }
        //}, true);
        function updateAllContainersSortOrder(containersObject) {
            angular.forEach(containersObject, function (value, key) {
                var container = value;
                for (var i = 0; i < container.Blocks.length; i++) {
                    container.Blocks[i].SortOrder = i;
                }
            });
        }
        $scope.uiState = new WebBlocks.UI.UIState({
            LayoutBuilder: new WebBlocks.UI.LayoutBuilderState(true, $scope.model.config.canvasWidth),
            IframeEditor: new WebBlocks.UI.IframeEditorState(false, "/umbraco#/"),
            AddBlockDialogState: new WebBlocks.UI.AddBlockDialogState(getIntOrDefault($scope.model.config.rootBlockFolderId, -1)),
            ContentNavigationVisible: true
        });
        $scope.updateIframeDocumentStyles = function (iframeElement) {
            setTimeout(function () {
                updateStylesWhenDocReady();
                function updateStylesWhenDocReady() {
                    console.log("checking");
                    if (iframeElement.contentDocument.readyState == "complete") {
                        console.log("doing stuff now");
                        var $iframeDoc = $(iframeElement.contentDocument);
                        $iframeDoc.find("#leftcolumn").hide();
                        $iframeDoc.find("#contentwrapper").css({ "left": "0px" });
                    }
                    else {
                        console.log("notcomplete");
                        setTimeout(function () {
                            updateStylesWhenDocReady();
                        }, 300);
                    }
                }
            }, 1500);
        };
        $scope.getSortableOptions = function (blockList) {
            return {
                handle: ":not(.wbAction)",
                connectWith: $scope.model.config.disableContainerDragging == true || $scope.model.config.disableContainerDragging == 1 ? "" : ".wbcontainer",
                modelData: blockList,
                over: function (e, ui) {
                    $scope.currentSortableHoveredContainer = $scope.$eval($(e.target).attr("wb-container-model"));
                },
                update: function (e, ui) {
                    //if sender is not null, this means the container which had the block dropped on it is being updated
                    if (ui.sender != null) {
                    }
                    else {
                        //set the current dragged block
                        var draggedBlock = $scope.$eval($(ui.item.parent()).attr("ng-model"))[ui.item.index()];
                        var newContainer = $scope.currentSortableHoveredContainer;
                        if (typeof (newContainer) == "undefined") {
                            return;
                        }
                        //if this is a node block and has constraints
                        if (draggedBlock instanceof WebBlocks.LayoutBuilder.NodeBlock && newContainer.ContainerPermissions != null) {
                            if (!newContainer.ContainerPermissions.Validate(draggedBlock)) {
                                ui.item.sortable.cancel();
                                notificationsService.warning(draggedBlock.ContentTypeAlias + " not allowed in this container");
                            }
                        }
                        else if (draggedBlock instanceof WebBlocks.LayoutBuilder.WysiwygBlock) {
                            if (!newContainer.WysiwygsAllowed) {
                                ui.item.sortable.cancel();
                                notificationsService.warning("Wysiwyg Blocks are not allowed in this container");
                            }
                        }
                    }
                },
                stop: function (e, ui) {
                    //we will now update all block sortorders in all containers
                    updateAllContainersSortOrder(layoutBuilderModel.Containers);
                }
            };
        };
        $scope.handleBlockDropped = function (draggableBlockModel, event, containerElement) {
            var success = true;
            var container = $scope.$eval($(containerElement).attr("wb-container-model"));
            var block = draggableBlockModel.Block;
            if (draggableBlockModel.ShouldClone == true) {
                //clone the block
                block = draggableBlockModel.Block instanceof WebBlocks.LayoutBuilder.NodeBlock ? new WebBlocks.LayoutBuilder.NodeBlock() : new WebBlocks.LayoutBuilder.WysiwygBlock();
                angular.copy(draggableBlockModel.Block, block);
            }
            if (draggableBlockModel.LoadContent == true && draggableBlockModel.Block instanceof WebBlocks.LayoutBuilder.NodeBlock) {
                loadBlockContent(block, function () {
                    $scope.$apply(function () {
                        //validate the block (ie, it didn't have a partial view - hence it is not a block
                        if (!WebBlocks.API.WebBlocksAPIClent.ValidateRenderedBlock(block)) {
                            notificationsService.warning("Not a valid block");
                            success = false;
                            return;
                        }
                        //validate the block content type before adding to the container
                        contentResource.getById(block.Id).then(function (content) {
                            //set the content type alias
                            block.ContentTypeAlias = content.contentTypeAlias;
                            //validate against the content type alias
                            //if container permissions are set, and is valid
                            if (container.ContainerPermissions == null || (container.ContainerPermissions != null && container.ContainerPermissions.Validate(block))) {
                                container.Blocks.push(block);
                                draggableBlockModel.OnDropCallback(draggableBlockModel);
                                //we will now update all block sortorders in all containers
                                updateAllContainersSortOrder(layoutBuilderModel.Containers);
                            }
                            else {
                                notificationsService.warning(content.contentTypeName + " not allowed in this container");
                                success = false;
                            }
                        });
                    });
                });
            }
            else if (draggableBlockModel.Block instanceof WebBlocks.LayoutBuilder.WysiwygBlock) {
                if (container.WysiwygsAllowed) {
                    container.Blocks.push(block);
                    draggableBlockModel.OnDropCallback(draggableBlockModel);
                    //we will now update all block sortorders in all containers
                    updateAllContainersSortOrder(layoutBuilderModel.Containers);
                }
                else {
                    notificationsService.warning("Wysiwyg Blocks are not allowed in this container");
                    success = false;
                }
            }
        };
        function loadBlockContent(block, callback) {
            var url = "/umbraco/surface/BlockRenderSurface/RenderBlock?wbPreview=true&pageId=" + editorState.current.id + "&blockId=" + block.Id;
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'html',
                cache: false,
                success: function (data) {
                    $scope.$apply(function () {
                        var renderedBlockEl = $(data);
                        block.ViewModel.Tag = "div";
                        block.ViewModel.Classes = $(renderedBlockEl).attr("class");
                        block.ViewModel.Html = $(renderedBlockEl).html();
                        block.ViewModel.Attributes = [];
                        $.each(renderedBlockEl[0].attributes, function () {
                            // this.attributes is not a plain object, but an array
                            // of attribute nodes, which contain both the name and value
                            if (this.specified && this.name != "class") {
                                block.ViewModel.Attributes.push({ Name: this.name, Value: this.value });
                            }
                        });
                    });
                    callback();
                }
            });
        }
        $scope.showAddBlockDialog = function () {
            var addBlockMenu = new WebBlocks.UI.Dialogs.AddBlockMenu($scope.uiState);
            dialogService.closeAll();
            dialogService.open(WebBlocks.UI.Dialogs.DialogOptionsFactory.BuildAddBlockDialogOptions(addBlockMenu));
        };
        $scope.showBlockStorageDialog = function () {
            dialogService.closeAll();
            dialogService.open(WebBlocks.UI.Dialogs.DialogOptionsFactory.BuildBlockStorageDialogOptions(layoutBuilderModel));
        };
        $scope.showRecycleBinDialog = function () {
            dialogService.closeAll();
            dialogService.open(WebBlocks.UI.Dialogs.DialogOptionsFactory.BuildRecycleBinDialogOptions(layoutBuilderModel));
        };
        //handle right click event for blocks
        $scope.showEditBlockDialog = function (sender, block, container) {
            var contextMenu = new WebBlocks.UI.Dialogs.ContextMenu([{ Name: "Edit", IconClass: "icon-edit" }, { Name: "Move to block storage", IconClass: "icon-folder" }, { Name: "Delete", IconClass: "icon-trash" }], { block: block, container: container, blockElement: sender });
            dialogService.open(WebBlocks.UI.Dialogs.DialogOptionsFactory.BuildContextMenuDialogOptions(contextMenu, $scope.handleEditBlockDialog));
        };
        $scope.editBlock = function (blockElement, block, container, applyScope) {
            if (applyScope === void 0) {
                applyScope = true;
            }
            if (block instanceof WebBlocks.LayoutBuilder.NodeBlock) {
                if (applyScope)
                    $scope.$apply(function () {
                        editNodeBlock(block);
                    });
                else
                    editNodeBlock(block);
            }
            else if (block instanceof WebBlocks.LayoutBuilder.WysiwygBlock) {
                $(blockElement).removeClass("wbWysiwygOff");
                var session = {
                    id: WebBlocks.Utils.GuidHelper.GenerateGuid(),
                    block: block,
                    element: blockElement,
                    tinyMceConfig: {
                        label: 'bodyText',
                        description: 'Enter notes for editor',
                        view: 'rte',
                        value: block.Content,
                        config: {
                            editor: {
                                toolbar: ["code", "undo", "redo", "cut", "styleselect", "bold", "italic", "alignleft", "aligncenter", "alignright", "bullist", "numlist", "link", "umbmediapicker", "umbmacro", "umbembeddialog"],
                                stylesheets: [$scope.model.config.wysiwygStylesheet],
                                dimensions: {}
                            }
                        }
                    }
                };
                //TODO: type the session
                $scope.activeEditSessions[session.id] = session;
                if (block.Content != block.ViewModel.Html)
                    return;
                //set a compile flag on the block view model and move this to directive (excl newElement)
                var newElement = $("<div><umb-editor model=\"activeEditSessions['" + session.id + "'].tinyMceConfig\"></umb-editor><div class='wb-wysiwyg-action-bar'><input type='button' class='btn btn-warning' value='Cancel' ng-click=\"updateWysiwygBlockCancel('" + session.id + "')\" /><input type='button' class='btn btn-success' value='Accept' ng-click=\"updateWysiwygBlock('" + session.id + "')\" /></div></div>");
                //session.block.ViewModel.ShouldCompile = true;
                //session.block.ViewModel.ShouldRerender = true;
                //session.block.ViewModel.ShouldForceRerender = true;
                $compile(newElement)($scope);
                $(blockElement).empty();
                $(blockElement).append(newElement);
                $(blockElement).click();
                setTimeout(function () {
                    $(blockElement).click();
                }, 2500);
                //disable sorting on parent container
                $(blockElement.parent()).sortable("disable");
            }
        };
        //gets called in $scope.EditBlock when activating the edit mode for a node block
        function editNodeBlock(block) {
            var uiState = $scope.uiState;
            uiState.LayoutBuilder.Visible = false;
            uiState.IframeEditor.Visible = true;
            uiState.IframeEditor.Url = "/umbraco/#/content/content/edit/" + block.Id;
            uiState.IframeEditor.BlockId = block.Id;
        }
        //gets a rendered copy of the block and updates the content and element property on all blocks on page
        $scope.updateAllBlockElementsInAllContainers = function (blockId) {
            var renderedBlock = new WebBlocks.LayoutBuilder.NodeBlock();
            renderedBlock.Id = blockId;
            loadBlockContent(renderedBlock, function () {
                angular.forEach(layoutBuilderModel.Containers, function (container, containerName) {
                    for (var i = 0; i < container.Blocks.length; i++) {
                        if (container.Blocks[i].Id == blockId) {
                            var clonedBlockElement = angular.copy(renderedBlock.ViewModel);
                            container.Blocks[i].ViewModel = clonedBlockElement;
                            container.Blocks[i].ViewModel.ShouldRerender = true;
                        }
                    }
                });
            });
        };
        // handle wysiwyg update, for session
        $scope.updateWysiwygBlock = function (sessionId) {
            var session = $scope.activeEditSessions[sessionId];
            session.block.Content = session.tinyMceConfig.value != "" ? session.tinyMceConfig.value : "<p></p>";
            session.block.ViewModel.Html = session.block.Content;
            //(<WebBlocks.LayoutBuilder.Block>session.block).ViewModel.ShouldRerender = true;
            //(<WebBlocks.LayoutBuilder.Block>session.block).ViewModel.ShouldCompile = false;
            $(session.element).empty();
            $(session.element).append($(session.block.Content));
            if (session.block.Content == "<p>&nbsp;</p>" || session.block.Content == "<p></p>" || session.block.Content == "")
                $(session.element).addClass("wbWysiwygOff");
            // todo: create a block content helper
            $(session.element).find("a, input[type='button'], input[type='submit'], button").on("click", function (e) {
                e.preventDefault();
                return false;
            });
            setTimeout(function () {
                $(session.element).click(); //trigger rerender
            }, 150);
            //enable sorting on parent container
            $(session.element.parent()).sortable("enable");
            notificationsService.success("Successfully updated");
        };
        // handle wysiwyg cancel update event, for session
        $scope.updateWysiwygBlockCancel = function (sessionId) {
            var session = $scope.activeEditSessions[sessionId];
            session.block.ViewModel.Html = session.block.Content;
            //(<WebBlocks.LayoutBuilder.Block>session.block).ViewModel.ShouldRerender = true;
            //(<WebBlocks.LayoutBuilder.Block>session.block).ViewModel.ShouldCompile = false;
            $(session.element).empty();
            $(session.element).append($(session.block.Content));
            if (session.block.Content == "<p>&nbsp;</p>" || session.block.Content == "<p></p>" || session.block.Content == "")
                $(session.element).addClass("wbWysiwygOff");
            // todo: create a block content helper
            $(session.element).find("a, input[type='button'], input[type='submit'], button").on("click", function (e) {
                e.preventDefault();
                return false;
            });
            setTimeout(function () {
                $(session.element).click(); //trigger rerender
            }, 150);
            //enable sorting on parent container
            $(session.element.parent()).sortable("enable");
            notificationsService.warning("Update cancelled");
        };
        $scope.handleEditBlockDialog = function (event) {
            if (typeof (event) == 'undefined')
                return;
            var block = event.EventData.block;
            var blockElement = event.EventData.blockElement;
            var container = event.EventData.container;
            switch (event.Event) {
                case 'Edit':
                    $scope.editBlock(blockElement, block, container, false);
                    break;
                case 'Move to block storage':
                    var blockStorageBlock = new WebBlocks.LayoutBuilder.BlockStorageBlock(block, "", new WebBlocks.LayoutBuilder.BlockHistory(container.Name));
                    layoutBuilderModel.BlockStorage.push(blockStorageBlock);
                    removeFromArray(container.Blocks, block);
                    notificationsService.success("Successfully added to block storage");
                    break;
                case 'Delete':
                    if (block.IsTemplateBlock) {
                        block.IsDeletedBlock = true;
                    }
                    else {
                        var recycleBinBlock = new WebBlocks.LayoutBuilder.RecycleBinBlock(block, "", new WebBlocks.LayoutBuilder.BlockHistory(container.Name));
                        layoutBuilderModel.RecycleBin.push(recycleBinBlock);
                        removeFromArray(container.Blocks, block);
                        notificationsService.success("Successfully added to the recycle bin.");
                    }
                    break;
            }
        };
        function removeFromArray(arr, item) {
            var i;
            while ((i = arr.indexOf(item)) !== -1) {
                arr.splice(i, 1);
            }
        }
        function isInCreateMode() {
            return window.location.hash.indexOf("create=true") >= 0;
        }
        //triggers an ajax call to load containers and layoutbuilder html
        //callback is called after the layout builder model is loaded and containers have been set
        //returns the layoutbuilder model that will be loaded into
        function loadLayoutBuilder(callback) {
            if (isInCreateMode()) {
                var layoutBuilderNew = new WebBlocks.LayoutBuilder.LayoutBuilder();
                return layoutBuilderNew;
            }
            var layoutBuilderModel = new WebBlocks.LayoutBuilder.LayoutBuilder();
            if ($scope.model.value !== undefined) {
                if ($scope.model.value.BlockStorage !== undefined) {
                    layoutBuilderModel.BlockStorage = $scope.model.value.BlockStorage;
                    for (var i = 0; i < layoutBuilderModel.BlockStorage.length; i++) {
                        layoutBuilderModel.BlockStorage[i].Block = WebBlocks.LayoutBuilder.TypedBlockConverter.TypeIt(layoutBuilderModel.BlockStorage[i].Block);
                    }
                }
                if ($scope.model.value.RecycleBin !== undefined) {
                    layoutBuilderModel.RecycleBin = $scope.model.value.RecycleBin;
                    for (var i = 0; i < layoutBuilderModel.RecycleBin.length; i++) {
                        layoutBuilderModel.RecycleBin[i].Block = WebBlocks.LayoutBuilder.TypedBlockConverter.TypeIt(layoutBuilderModel.RecycleBin[i].Block);
                    }
                }
            }
            var previewProvider = new WebBlocks.API.LayoutBuilderPreview();
            previewProvider.GetPreview(editorState.current.id, $scope.model.config.memberUsername, $http, function (preview) {
                //if a container was removed, we want to move the blocks into Block Storage
                angular.forEach($scope.model.value.Containers, function (savedContainer, savedContainerName) {
                    console.log(savedContainerName);
                    var found = false;
                    angular.forEach(preview.Containers, function (liveContainer, liveContainerName) {
                        if (liveContainer.Name == savedContainer.Name)
                            found = true;
                    });
                    if (!found) {
                        //strongly type all blocks before moving in
                        WebBlocks.LayoutBuilder.TypedBlockConverter.TypeAll(savedContainer.Blocks);
                        for (var i = 0; i < savedContainer.Blocks.length; i++) {
                            layoutBuilderModel.BlockStorage.push(new WebBlocks.LayoutBuilder.BlockStorageBlock(savedContainer.Blocks[i], "Missing container", new WebBlocks.LayoutBuilder.BlockHistory(savedContainer.Name)));
                        }
                    }
                });
                layoutBuilderModel.Containers = preview.Containers;
                //load in canvas angular html
                //$element.find("#canvasRender").empty().append(layoutBuilderElements);
                var elToAppend = $(preview.Html);
                $element.find("#canvasRender").empty();
                for (var i = 0; i < elToAppend.length; i++) {
                    var layoutBuilderElements = $compile(elToAppend[i].outerHTML)($scope);
                    //load in canvas angular html
                    $element.find("#canvasRender").append(layoutBuilderElements);
                }
                callback();
            });
            return layoutBuilderModel;
        }
        //Button Click - ToggleUmbracoNavigation
        $scope.toggleUmbracoNavigation = function () {
            //Get the current state of showNavigation
            var currentNavigationState = appState.getGlobalState('showNavigation');
            //Toggle the tree visibility
            appState.setGlobalState("showNavigation", !currentNavigationState);
        };
        //The eventService allows us to easily listen for any events that the Umbraco applciation fires
        //Let's listen for globalState changes...
        eventsService.on("appState.globalState.changed", function (e, args) {
            //console.log("appState.globalState.changed (args)", args);
            if (args.key === "showNavigation") {
                //console.log("showNavigation value", args.key, args.value);
                //If false (So hiding navigation)
                if (!args.value) {
                    //Set css left position to 80px (width of appBar)
                    document.getElementById("contentwrapper").style.left = "80px";
                    $scope.uiState.ContentNavigationVisible = false;
                }
                else {
                    //Remove the CSS we set so default CSS of Umbraco kicks in
                    document.getElementById("contentwrapper").style.left = "";
                    $scope.uiState.ContentNavigationVisible = true;
                }
            }
        });
        //hide navigation depending on the settings
        if ($scope.model.config.autoHideContentTree == true || $scope.model.config.autoHideContentTree == 1)
            appState.setGlobalState("showNavigation", false);
        if ($scope.model.config.scripts.lenght > 0)
            assetsService.loadJs($scope.model.config.scripts, $scope);
        assetsService.loadCss("/App_Plugins/WebBlocks/Css/WebBlocks.css");
        for (var i = 0; i < $scope.model.config.stylesheets.length; i++) {
            assetsService.loadCss($scope.model.config.stylesheets[i].value);
        }
        function emptyArray(arr) {
            while (arr.length > 0) {
                arr.pop();
            }
        }
        function getIntOrDefault(val, def) {
            if (typeof (val) === "number") {
                return val;
            }
            else if (typeof (val) === "string") {
                var convertedVal = parseInt(val);
                return !isNaN(convertedVal) ? convertedVal : def;
            }
            return def;
        }
    }]);
//# sourceMappingURL=layoutbuilder.controller.js.map
//# sourceMappingURL=layoutbuilder.controller.js.map