angular.module("umbraco")
    .controller("WebBlocks.LayoutBuilder",
    function ($scope, appState, eventsService, assetsService, dialogService, notificationsService, $compile) {
        var blockType = {
            WYSIWYG: "WYSIWYG",
            NODE: "NODE"
        };

        $scope.wysiwygEditorUrl = "/App_Plugins/WebBlocks/LayoutBuilder.WysiwygEditor.html";

        $scope.config = {
            canvasWidth: 960
        };

        $scope.state = {
            navigationVisible: false
        };

        $scope.editorIframeSrc = "";

        $scope.model = {
            containers: {
                "contentContainer": {
                    blocks: [
                        {
                            _type: blockType.NODE,
                            contentId: 1000,
                            name: "Angular powered",
                            content: '<div class="siteBlock featureBlock"><div class="blockImage"><img src="http://www.andrewboni.com/images/2013-08-25/angularjs.jpeg" /></div><div class="blockTitle">Angular powered</div></div>',
                            sortOrder: 1,
                            element: {
                                tag: "div",
                                classes: "grid_3 block",
                                attrs: [
                                    { name: "test", value: "booya" }
                                ]
                            }
                        },
                        {
                            _type: blockType.NODE,
                            contentId: 1000,
                            name: "Open source",
                            content: '<div class="siteBlock featureBlock"><div class="blockImage"><img src="https://octodex.github.com/images/octobiwan.jpg" /></div><div class="blockTitle">Open source</div></div>',
                            sortOrder: 1,
                            element: {
                                tag: "div",
                                classes: "grid_3 block",
                                attrs: [
                                    { name: "test", value: "booya" }
                                ]
                            }
                        },
                        {
                            _type: blockType.NODE,
                            contentId: 1000,
                            name: 'Drag and Drop feature block',
                            content: '<div class="siteBlock featureBlock"><div class="blockImage"><img src="http://dockphp.com/img/drag-icon.png" /></div><div class="blockTitle">Drag and Drop</div></div>',
                            sortOrder: 2,
                            element: {
                                tag: "div",
                                classes: "grid_3 block",
                                attrs: [
                                    { name: "test", value: "booya" }
                                ]
                            }
                        },
                        {
                            _type: blockType.WYSIWYG,
                            name: "Wysiwyg",
                            html: "<div class='umb-editor umb-rte'><umb-editor model='block.editornotes'></umb-editor></div>",
                            content: "<p>This is a test</p>",
                            sortOrder: 1,
                            sessionId: "", //edit wysiwyg block session id
                            element: {
                                tag: "div",
                                classes: "grid_9 block wysiwyg",
                                attrs: [
                                    { name: "test", value: "booya" }
                                ]
                            }
                        }
                    ]
                },
                "sideContainer": {
                    blocks: [

                        {
                            _type: blockType.NODE,
                            contentId: 1000,
                            name: 'Introduction to Web Blocks feature block',
                            content: '<div class="siteBlock featureBlock"><div class="blockImage"><img src="http://www.mentorwebblocks.com/images/logo.png" /></div><div class="blockTitle">Welcome to Web Blocks</div></div>',
                            sortOrder: 1,
                            element: {
                                tag: "div",
                                classes: "grid_3 block",
                                attrs: [
                                    { name: "test", value: "booya" }
                                ]
                            }
                        },
                        {
                            _type: blockType.NODE,
                            contentId: 1000,
                            name: 'Content Editor friendly',
                            content: '<div class="siteBlock featureBlock"><div class="blockImage"><img src="http://d1v2fthkvl8xh8.cloudfront.net/wp-content/uploads/2011/10/donoterasewriting.jpg" /></div><div class="blockTitle">Content editor friendly</div></div>',
                            sortOrder: 2,
                            element: {
                                tag: "div",
                                classes: "grid_3 block",
                                attrs: [
                                    { name: "test", value: "booya" }
                                ]
                            }
                        }
                    ]
                },
                "bottomContainer": {
                    blocks: [
                        
                        {
                            _type: blockType.NODE,
                            contentId: 1000,
                            name: "Friendly support",
                            content: '<div class="siteBlock featureBlock"><div class="blockImage"><img src="https://www.innoforce.com/sites/default/files/images/various/support.png" /></div><div class="blockTitle">Friendly support</div></div>',
                            sortOrder: 2,
                            element: {
                                tag: "div",
                                classes: "grid_3 block",
                                attrs: [
                                    { name: "test", value: "booya" }
                                ]
                            }
                        },
                        {
                            _type: blockType.WYSIWYG,
                            name: "Wysiwyg",
                            html: "<div class='umb-editor umb-rte'><umb-editor model='block.editornotes'></umb-editor></div>",
                            content: "<p>This is a test</p>",
                            sortOrder: 1,
                            sessionId: "", //edit wysiwyg block session
                            element: {
                                tag: "div",
                                classes: "grid_9 block wysiwyg",
                                attrs: [
                                    { name: "test", value: "booya" }
                                ]
                            }
                        }
                    ]
                }
            },
            blockStorage: [],
            recycleBin: []
        };

        $scope.ui = {
            showLayoutBuilder: true,
            showIFrameEditor: false
        }

        $scope.getSortableOptions = function(blockList){
            return {
                handle: ":not(.wbAction)",
                connectWith: ".wbcontainer",
                modelData: blockList
            };
        }

        //$scope.wysiwygConfig = {
        //    label: 'bodyText',
        //    description: 'Enter notes for editor',
        //    view: 'rte',
        //    value: "",
        //    config: {
        //        editor: {
        //            toolbar: ["code", "undo", "redo", "cut", "styleselect", "bold", "italic", "alignleft", "aligncenter", "alignright", "bullist", "numlist", "link", "umbmediapicker", "umbmacro", "umbembeddialog"],
        //            stylesheets: [],
        //            dimensions: {}
        //        }
        //    }
        //};

        $scope.handleBlockDropped = function (data, event, containerElement) {
            var container = $scope.$eval($(containerElement).attr("wb-container-model"));
            container.blocks.push(data.block);

            if (data.shouldRemoveFromOrigin) {
                //remove block from any origin block arrays passed - such as the recycle bin
                for (var i = 0; i < data.originBlockArray.length; i++)
                    removeFromArray(data.originBlockArray[i], data.block);

                //remove the draggable block model from any arrays passed - such as the recycle bin dialog draggable block array
                for (var i = 0; i < data.originDraggableBlockArray.length; i++) {
                    removeFromArray(data.originDraggableBlockArray[i], data);
                }
            }
        };

        $scope.showAddBlockDialog = function () {
            dialogService.open({ template: "/app_plugins/WebBlocks/Dialogs/WebBlocks.AddBlockDialog.html", show: true });
        };

        $scope.showBlockStorageDialog = function () {
            dialogService.open({ template: "/app_plugins/WebBlocks/Dialogs/WebBlocks.BlockStorageDialog.html", show: true, modelData: $scope.model.blockStorage });
        };

        $scope.showRecycleBinDialog = function () {
            dialogService.open({ template: "/app_plugins/WebBlocks/Dialogs/WebBlocks.RecycleBinDialog.html", show: true, modelData: $scope.model.recycleBin });
        };

        //handle right click event for blocks
        $scope.showEditBlockDialog = function (sender, block, container) {
            var events = [ { name: "Edit", icon: "icon-edit" }, { name: "Move to block storage", icon: "icon-folder" }, { name: "Delete", icon: "icon-trash" }];
            var eventData = { block: block, container: container, blockElement: sender };
            dialogService.open({ template: "/app_plugins/WebBlocks/Dialogs/WebBlocks.ContextMenuDialog.html", show: true, modalClass: 'wb-context-menu umb-modal', modelData: { events: events, eventData: eventData }, callback: $scope.handleEditBlockDialog });
        };

        $scope.activeEditSessions = {};

        $scope.editBlock = function (blockElement, block, container) {
            if (block._type == blockType.NODE) {
                $scope.ui.showLayoutBuilder = false;
                $scope.ui.showIFrameEditor = true;
                $scope.editorIframeSrc = "/umbraco/#/content/content/edit/1052";
            }
            else if (block._type == blockType.WYSIWYG) {
                var session = {
                    id: generateSessionId(),
                    block: block,
                    element: blockElement,
                    tinyMceConfig: {
                        label: 'bodyText',
                        description: 'Enter notes for editor',
                        view: 'rte',
                        value: block.content,
                        config: {
                            editor: {
                                toolbar: ["code", "undo", "redo", "cut", "styleselect", "bold", "italic", "alignleft", "aligncenter", "alignright", "bullist", "numlist", "link", "umbmediapicker", "umbmacro", "umbembeddialog"],
                                stylesheets: [],
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

        // handle wysiwyg update, for session
        $scope.updateWysiwygBlock = function (sessionId) {
            var session = $scope.activeEditSessions[sessionId];
            session.block.content = session.tinyMceConfig.value;
            $(session.element).empty();
            $(session.element).append($(session.block.content));

            // todo: create a block content helper
            $(session.element).find("a, input[type='button'], input[type='submit'], button").on("click", function (e) {
                e.preventDefault();
                return false;
            });

            //enable sorting on parent container
            $(session.element.parent()).sortable("enable");
        };

        // handle wysiwyg cancel update event, for session
        $scope.updateWysiwygBlockCancel = function (sessionId) {
            var session = $scope.activeEditSessions[sessionId];
            $(session.element).empty();
            $(session.element).append($(session.block.content));

            // todo: create a block content helper
            $(session.element).find("a, input[type='button'], input[type='submit'], button").on("click", function (e) {
                e.preventDefault();
                return false;
            });

            //enable sorting on parent container
            $(session.element.parent()).sortable("enable");
        };

        $scope.handleEditBlockDialog = function (event) {
            var block = event.eventData.block;
            var blockElement = event.eventData.blockElement;
            var container = event.eventData.container;
            switch (event.event) {
                case 'Edit':
                    $scope.editBlock(blockElement, block, container);
                    break;
                case 'Move to block storage':
                    $scope.model.blockStorage.push(block);
                    removeFromArray(container.blocks, block);
                    notificationsService.success("Successfully added to block storage");
                    break;
                case 'Delete':
                    $scope.model.recycleBin.push(block);
                    removeFromArray(container.blocks, block);
                    notificationsService.success("Successfully added to the recycle bin.");
                    break;
            }
        };

        function removeFromArray(arr, item) {
            var i;
            while ((i = arr.indexOf(item)) !== -1) {
                arr.splice(i, 1);
            }
        }

        var generateSessionId = (function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                           .toString(16)
                           .substring(1);
            }
            return function() {
                return s4() + s4() + s4() + s4()  +
                       s4()  + s4() + s4() + s4();
            };
        })();

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
        
    });

