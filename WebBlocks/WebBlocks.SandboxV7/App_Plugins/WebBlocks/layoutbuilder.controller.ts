/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/jqueryui/jqueryui.d.ts" />

angular.module("umbraco")
    .controller("WebBlocks.LayoutBuilder",
    function ($scope: any, $http: ng.IHttpService, $element: JQuery, appState: any, eventsService: any, assetsService, dialogService, notificationsService, $compile: ng.ICompiledExpression) {
        
        //$scope.wysiwygEditorUrl = "/App_Plugins/WebBlocks/LayoutBuilder.WysiwygEditor.html";

        $scope.activeEditSessions = {};
        
        $scope.config = {
            canvasWidth: 960
        };

        $scope.state = {
            navigationVisible: false
        };

        //need to keep types, and umbraco replaces typed models with plain json objects after saving.
        //The approach is to use the layoutBuilderModel to reference a working layout builder.  And $scope.model.value will be a clone.
        //When the working model is updated, we will clone it over to $scope.model.value

        //so first, I create a reference variable to use in the code.  This will be the working layout builder
        var layoutBuilderModel : WebBlocks.LayoutBuilder.LayoutBuilder = null;
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

        function updateAllContainersSortOrder(containersObject : any) {
            angular.forEach(containersObject, function (value, key) {
                var container = <WebBlocks.LayoutBuilder.Container>value;
                for (var i = 0; i < container.Blocks.length; i++) {
                    container.Blocks[i].SortOrder = i;
                }
            });
        }
        

        $scope.uiState = new WebBlocks.UI.UIState({
            LayoutBuilder: new WebBlocks.UI.LayoutBuilderState(true),
            IframeEditor: new WebBlocks.UI.IframeEditorState(false)
        });

        $scope.getSortableOptions = function (blockList : Array<WebBlocks.LayoutBuilder.Block>) {
            return {
                handle: ":not(.wbAction)",
                connectWith: ".wbcontainer",
                modelData: blockList,
                stop: function (e, ui) {
                    //we will now update all block sortorders in all containers
                    updateAllContainersSortOrder(layoutBuilderModel.Containers)
                }
            };
        }

        $scope.handleBlockDropped = function (draggableBlockModel: WebBlocks.UI.DraggableBlockModel, event, containerElement) {
            var container = <WebBlocks.LayoutBuilder.Container>$scope.$eval($(containerElement).attr("wb-container-model"));

            var block = <WebBlocks.LayoutBuilder.Block>draggableBlockModel.Block;

            if (draggableBlockModel.ShouldClone == true) {
                //clone the block
                block = draggableBlockModel.Block instanceof WebBlocks.LayoutBuilder.NodeBlock ?
                    new WebBlocks.LayoutBuilder.NodeBlock() :
                    new WebBlocks.LayoutBuilder.WysiwygBlock();
                angular.copy(draggableBlockModel.Block, block);
            }

            if (draggableBlockModel.LoadContent == true && draggableBlockModel.Block instanceof WebBlocks.LayoutBuilder.NodeBlock) {

                loadBlockContent(block, function () {
                    $scope.$apply(function () {
                        container.Blocks.push(block);
                    });
                });
            }
            else {
                container.Blocks.push(block);
            }

            //we will now update all block sortorders in all containers
            updateAllContainersSortOrder(layoutBuilderModel.Containers)

            draggableBlockModel.OnDropCallback(draggableBlockModel);
        };

        function loadBlockContent(block: WebBlocks.LayoutBuilder.Block, callback: () => void) {
            var currentContentId = getCurrentContentId();
            var url = "/umbraco/surface/BlockRenderSurface/RenderBlock?wbPreview=true&pageId=" + currentContentId + "&blockId=" + block.Id;
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
            var addBlockMenu = new WebBlocks.UI.Dialogs.AddBlockMenu(-1, $scope);
            dialogService.open(WebBlocks.UI.Dialogs.DialogOptionsFactory.BuildAddBlockDialogOptions(addBlockMenu));
        };

        $scope.showBlockStorageDialog = function () {
            dialogService.open(WebBlocks.UI.Dialogs.DialogOptionsFactory.BuildBlockStorageDialogOptions(layoutBuilderModel));
        };

        $scope.showRecycleBinDialog = function () {
            dialogService.open(WebBlocks.UI.Dialogs.DialogOptionsFactory.BuildRecycleBinDialogOptions(layoutBuilderModel));
        };

        //handle right click event for blocks
        $scope.showEditBlockDialog = function (sender, block, container) {
            var contextMenu = new WebBlocks.UI.Dialogs.ContextMenu(
                [{ Name: "Edit", IconClass: "icon-edit" }, { Name: "Move to block storage", IconClass: "icon-folder" }, { Name: "Delete", IconClass: "icon-trash" }],
                { block: block, container: container, blockElement: sender }
                );
            dialogService.open(WebBlocks.UI.Dialogs.DialogOptionsFactory.BuildContextMenuDialogOptions(contextMenu, $scope.handleEditBlockDialog));
        };



        $scope.editBlock = function (blockElement, block: WebBlocks.LayoutBuilder.Block, container: WebBlocks.LayoutBuilder.Block, applyScope: boolean = true) {
            if (block instanceof WebBlocks.LayoutBuilder.NodeBlock) {
                if (applyScope)
                    $scope.$apply(function () { editNodeBlock(block) });
                else
                    editNodeBlock(block);
                
            }
            else if (block instanceof WebBlocks.LayoutBuilder.WysiwygBlock) {

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
                                stylesheets: ["Wysiwyg.Backoffice"],
                                dimensions: {}
                            }
                        }
                    }
                };
                $scope.activeEditSessions[session.id] = session;
                var newElement = $("<div><umb-editor model='activeEditSessions[\"" + session.id + "\"].tinyMceConfig'></umb-editor><div class='wb-wysiwyg-action-bar'><input type='button' class='btn btn-warning' value='Cancel' ng-click='updateWysiwygBlockCancel(\"" + session.id + "\")' /><input type='button' class='btn btn-success' value='Accept' ng-click='updateWysiwygBlock(\"" + session.id + "\")' /></div></div>");
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
        function editNodeBlock(block: WebBlocks.LayoutBuilder.NodeBlock) {
            var uiState = <WebBlocks.UI.UIState>$scope.uiState;
            uiState.LayoutBuilder.Visible = false;
            uiState.IframeEditor.Visible = true;
            uiState.IframeEditor.Url = "/umbraco/#/content/content/edit/" + block.Id;
            uiState.IframeEditor.BlockId = block.Id;
        }

        //gets a rendered copy of the block and updates the content and element property on all blocks on page
        $scope.updateAllBlockElementsInAllContainers = function (blockId: number) {
            var renderedBlock: WebBlocks.LayoutBuilder.NodeBlock = new WebBlocks.LayoutBuilder.NodeBlock();
            renderedBlock.Id = blockId;

            loadBlockContent(renderedBlock, function () {
                angular.forEach(layoutBuilderModel.Containers, function (container: WebBlocks.LayoutBuilder.Container, containerName: string) {
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
            session.block.Content = session.tinyMceConfig.value;
            session.block.ViewModel.Html = session.block.Content;
            $(session.element).empty();
            $(session.element).append($(session.block.Content));

            // todo: create a block content helper
            $(session.element).find("a, input[type='button'], input[type='submit'], button").on("click", function (e) {
                e.preventDefault();
                return false;
            });

            //enable sorting on parent container
            $(session.element.parent()).sortable("enable");
            notificationsService.success("Successfully updated");
        };

        // handle wysiwyg cancel update event, for session
        $scope.updateWysiwygBlockCancel = function (sessionId) {
            var session = $scope.activeEditSessions[sessionId];
            $(session.element).empty();
            $(session.element).append($(session.block.Content));

            // todo: create a block content helper
            $(session.element).find("a, input[type='button'], input[type='submit'], button").on("click", function (e) {
                e.preventDefault();
                return false;
            });

            //enable sorting on parent container
            $(session.element.parent()).sortable("enable");
            notificationsService.warning("Update cancelled");
        };

        $scope.handleEditBlockDialog = function (event: WebBlocks.UI.Dialogs.ContextMenuResponse) {
            if (typeof (event) == 'undefined') return;

            var block = <WebBlocks.LayoutBuilder.Block>event.EventData.block;
            var blockElement = event.EventData.blockElement;
            var container = event.EventData.container;
            switch (event.Event) {
                case 'Edit':
                    $scope.editBlock(blockElement, block, container, false);
                    break;
                case 'Move to block storage':
                    var blockStorageBlock = new WebBlocks.LayoutBuilder.BlockStorageBlock(block, "");
                    layoutBuilderModel.BlockStorage.push(blockStorageBlock);
                    removeFromArray(container.Blocks, block);
                    notificationsService.success("Successfully added to block storage");
                    break;
                case 'Delete':
                    if (block.IsTemplateBlock) {
                        block.IsDeletedBlock = true;
                    }
                    else {
                        var recycleBinBlock = new WebBlocks.LayoutBuilder.RecycleBinBlock(block, "");
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

        function getCurrentContentId() {
            var segments = window.location.hash.split("/");
            var currentContentId = segments[segments.length - 1];
            return parseInt(currentContentId);
        }

        function isInCreateMode() {
            return window.location.hash.indexOf("create=true") >= 0;
        }

        //triggers an ajax call to load containers and layoutbuilder html
        //callback is called after the layout builder model is loaded and containers have been set
        //returns the layoutbuilder model that will be loaded into
        function loadLayoutBuilder(callback: () => void): WebBlocks.LayoutBuilder.LayoutBuilder {
            if (isInCreateMode()) {
                var layoutBuilderNew = new WebBlocks.LayoutBuilder.LayoutBuilder();
                return layoutBuilderNew;
            }
            var currentContentId = getCurrentContentId();
            var layoutBuilderModel = new WebBlocks.LayoutBuilder.LayoutBuilder();

            if ($scope.model.value !== undefined) {
                if ($scope.model.value.BlockStorage !== undefined) {
                    layoutBuilderModel.BlockStorage = $scope.model.value.BlockStorage;
                    //make sure all blocks in block storage are strongly typed
                    for (var i = 0; i < layoutBuilderModel.BlockStorage.length; i++) {
                        layoutBuilderModel.BlockStorage[i].Block = WebBlocks.LayoutBuilder.TypedBlockConverter.TypeIt(layoutBuilderModel.BlockStorage[i].Block);
                    }
                }
                if ($scope.model.value.RecycleBin !== undefined) {
                    layoutBuilderModel.RecycleBin = $scope.model.value.RecycleBin;
                    //make sure all blocks in recycle bin are strongly typed
                    for (var i = 0; i < layoutBuilderModel.RecycleBin.length; i++) {
                        layoutBuilderModel.RecycleBin[i].Block = WebBlocks.LayoutBuilder.TypedBlockConverter.TypeIt(layoutBuilderModel.RecycleBin[i].Block);
                    }
                }
            }

            var previewProvider = new WebBlocks.API.LayoutBuilderPreview();
            previewProvider.GetPreview(currentContentId, $http,
                function (preview) {

                    //if a container was removed, we want to move the blocks into Block Storage
                    angular.forEach($scope.model.value.Containers,(savedContainer: WebBlocks.LayoutBuilder.Container, savedContainerName: string) => {
                        console.log(savedContainerName);
                        var found = false;

                        angular.forEach(preview.Containers,(liveContainer: WebBlocks.LayoutBuilder.Container, liveContainerName: string) => {
                            if (liveContainer.Name == savedContainer.Name)
                                found = true;
                        });

                        if (!found) {
                            //strongly type all blocks before moving in
                            WebBlocks.LayoutBuilder.TypedBlockConverter.TypeAll(savedContainer.Blocks);
                            for (var i = 0; i < savedContainer.Blocks.length; i++) {
                                layoutBuilderModel.BlockStorage.push(new WebBlocks.LayoutBuilder.BlockStorageBlock(savedContainer.Blocks[i], "Originally from " + savedContainer.Name));
                            }
                        }
                    });

                    layoutBuilderModel.Containers = preview.Containers;
                    var layoutBuilderElements = $compile($(preview.Html)[0].outerHTML)($scope);
                    //load in canvas angular html
                    $element.find("#canvasRender").empty().append(layoutBuilderElements);
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
        }

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
                    $scope.state.navigationVisible = false;
                }
                else {
                    //Remove the CSS we set so default CSS of Umbraco kicks in
                    document.getElementById("contentwrapper").style.left = "";
                    $scope.state.navigationVisible = true;
                }
            }
        });

        //hide navigation by default
        appState.setGlobalState("showNavigation", false);

        var jsAssets = [];
        assetsService.loadJs(jsAssets, $scope);
        assetsService.loadCss("/App_Plugins/WebBlocks/Css/WebBlocks.css");
        assetsService.loadCss("/css/960.css");
        assetsService.loadCss("/css/global.backoffice.css");

        function emptyArray(arr) {
            while (arr.length > 0) {
                arr.pop();
            }
        }

    });