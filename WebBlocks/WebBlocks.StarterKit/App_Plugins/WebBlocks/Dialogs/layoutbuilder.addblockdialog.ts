angular.module("umbraco")
    .controller("WebBlocks.AddBlockDialogCtrl",
    function ($scope, $timeout, $http, appState, contentResource, contentTypeResource, entityResource, eventsService, assetsService, dialogService) {
        var dialogOptions = $scope.dialogOptions;
        var addBlockDialogContext = <WebBlocks.UI.Dialogs.AddBlockMenu>$scope.dialogOptions.modelData;
        var uiState = addBlockDialogContext.UIState;
        $scope.uiState = uiState;

        $scope.loaded = false; //show loader to start with

        $scope.ancestors = [];
        $scope.viewNavigationSource = [];
        $scope.menuLoadDelay = 0;
        $scope.showContextMenu = false;
        $scope.contextMenuModel = {
            allowedChildTypes: [],
            navigationModel: {}
        };

        $scope.templateDraggableWysiwygBlock = createDraggableWysiwygBlock();

        $scope.handleNavigationMore = function (navigationModel: WebBlocks.UI.Dialogs.NavigationViewModel) {
            $scope.showContextMenu = true;
            $scope.contextMenuModel.navigationModel = navigationModel;
            $scope.loadContextMenuAllowedChildTypes(navigationModel.Model.Id);
        }

        $scope.loadContextMenuAllowedChildTypes = function (contentId) {
            $scope.contextMenuModel.allowedChildTypes = [];
            contentTypeResource.getAllowedTypes(contentId)
                .then(function (array) {
                    $scope.contextMenuModel.allowedChildTypes = array;
            });
        }

        $scope.handleNavigationAction = function (event: string) {
            var navigationModel = <WebBlocks.UI.Dialogs.NavigationViewModel>$scope.contextMenuModel.navigationModel;
            switch (event) {
                case 'Create':
                    break;
                case 'EditOnPage':
                    uiState.IframeEditor.Visible = true;
                    uiState.LayoutBuilder.Visible = false;
                    uiState.IframeEditor.Url = "/umbraco/#/content/content/edit/" + navigationModel.Model.Id;
                    break;
                case 'EditNewWindow':
                    window.open("/umbraco/#/content/content/edit/" + navigationModel.Model.Id, "_blank");
                    break;
            }
        };

        $scope.handleNavigationCreateAction = function (contentType: string) {
            uiState.IframeEditor.Visible = true;
            uiState.LayoutBuilder.Visible = false;
            uiState.IframeEditor.Url = "/umbraco/#/content/content/edit/" + $scope.contextMenuModel.navigationModel.Model.Id +
            "?doctype=" + contentType + "&create=true";
            uiState.IframeEditor.BlockId = $scope.contextMenuModel.navigationModel.Model.Id;
        }

        $scope.loadChildNavigationIntoMenu = function (navigationModel : WebBlocks.UI.Dialogs.NavigationViewModel) {
            $scope.viewNavigationSource.show = false;
            $scope.loadContextMenuAllowedChildTypes(navigationModel.Model.Id);

            WebBlocks.API.WebBlocksAPIClent.GetNavigationChildren(navigationModel.Model.Id, $http, function (childNavigationItems) {
                // call the callback function
                $scope.loadChildNavigationIntoMenuCallback(navigationModel, childNavigationItems);
            });
        };

        // navigationModel = the navigation view model which will be the new root of the menu
        // childNavigationItems = the navigation items loaded from the api (we will create navigation meta data models for each, ready for the menu)
        $scope.loadChildNavigationIntoMenuCallback = function (navigationModel: WebBlocks.UI.Dialogs.NavigationViewModel, navigationChildren: Array<WebBlocks.API.Models.NavigationItem>) {
            $timeout(function () {
                navigationModel.Children = [];
                
                for (var i = 0; i < navigationChildren.length; i++) {
                    navigationModel.Children.push(createChildNavigationModel(navigationModel, navigationChildren[i]));
                }
                $scope.viewNavigationSource.navigationModel = navigationModel;
                $scope.viewNavigationSource.show = true;

                //set the active menu item - for reopening the dialog
                addBlockDialogContext.UIState.AddBlockDialogState.ActiveId = navigationModel.Model.Id;
                $scope.loaded = true;
            }, $scope.menuLoadDelay);
            $scope.menuLoadDelay = 200;
            $scope.ancestors = [];
            buildAncestorsList(navigationModel);
        };

        function buildAncestorsList(navigationModel: WebBlocks.UI.Dialogs.NavigationViewModel) {
            if (navigationModel.Parent != null) {
                buildAncestorsList(navigationModel.Parent);
                //$scope.ancestors.push(navigationModel);
            }               
            $scope.ancestors.push(navigationModel);
        }


        $scope.onWysiwygDragComplete = function (data, event) {
            //regenerate a new id for the draggable wysiwyg
            (<WebBlocks.UI.DraggableBlockModel>$scope.templateDraggableWysiwygBlock).Block.Id = WebBlocks.Utils.MathHelper.GenerateRandomNumber(10000, 52000);
        };


        function createChildNavigationModel(parent: WebBlocks.UI.Dialogs.NavigationViewModel, model: WebBlocks.API.Models.NavigationItem): WebBlocks.UI.Dialogs.NavigationViewModel {
            var child = new WebBlocks.UI.Dialogs.NavigationViewModel();
            child.Parent = parent;
            child.Model = model;
            child.DraggableBlock = createDraggableNodeBlock(model.Id, model.Name);
            child.Children = [];
            return child;
        }
       

        function init() {
            var startId = addBlockDialogContext.UIState.AddBlockDialogState.RootId != addBlockDialogContext.UIState.AddBlockDialogState.ActiveId ?
                addBlockDialogContext.UIState.AddBlockDialogState.ActiveId :
                addBlockDialogContext.UIState.AddBlockDialogState.RootId;
            $scope.root = createRootNavigationViewModel(startId);
            $scope.viewNavigationSource = { show: true, navigationItem: $scope.root };
            $scope.loadChildNavigationIntoMenu($scope.root)
        }

        init();

        function createRootNavigationViewModel(contentId: number): WebBlocks.UI.Dialogs.NavigationViewModel {
            var nvm = new WebBlocks.UI.Dialogs.NavigationViewModel();
            nvm.Model = new WebBlocks.API.Models.NavigationItem(contentId, "Root", "Null", "icon-folder", true);
            nvm.Children = new Array<WebBlocks.UI.Dialogs.NavigationViewModel>();
            if (contentId != uiState.AddBlockDialogState.RootId) {
                contentResource.getById(contentId)
                    .then(function (content) {
                        nvm.Parent = createRootNavigationViewModel(content.parentId);
                    });
            }
            return nvm;
        }
        
        function createDraggableNodeBlock(nodeId: number, nodeName: string) : WebBlocks.UI.DraggableBlockModel {
            var draggableBlock = new WebBlocks.UI.DraggableBlockModel();
            draggableBlock.Block = createNodeBlock(nodeId, nodeName);
            draggableBlock.LoadContent = true;
            draggableBlock.ShouldClone = true;
            draggableBlock.OnDropCallback = (draggableBlock) => { }
            return draggableBlock;
        }

        function createNodeBlock(nodeId: number, nodeName: string) : WebBlocks.LayoutBuilder.NodeBlock {
            var block = new WebBlocks.LayoutBuilder.NodeBlock();
            block.Id = nodeId;
            block.Name = nodeName;
            block.SortOrder = 10000;
            return block;
        }

        function createDraggableWysiwygBlock() : WebBlocks.UI.DraggableBlockModel {
            var draggableBlock = new WebBlocks.UI.DraggableBlockModel();
            draggableBlock.Block = createWysiwygBlock();
            draggableBlock.LoadContent = false;
            draggableBlock.ShouldClone = true;
            draggableBlock.OnDropCallback = (draggableBlock) => { }
            return draggableBlock;
        }

        function createWysiwygBlock() : WebBlocks.LayoutBuilder.WysiwygBlock {
            var block = new WebBlocks.LayoutBuilder.WysiwygBlock();
            block.Id = WebBlocks.Utils.MathHelper.GenerateRandomNumber(10000, 52000);
            block.Name = "Wysiwyg Block";
            block.SortOrder = 1000;
            block.Content = "<p>&nbsp;</p>";
            block.ViewModel.Html = "<p>&nbsp;</p>";
            return block;
        }




        ///// SEARCH
        //$scope.search = function (searchTerm) {
        //    entityResource.searchContent("name:'" + searchTerm + "'").then(function (results) {
        //        alert(results.length);
        //    });
        //};


    });






//function getChildNavigationItems(sourceId) {
//    return [new NavigationItemModel(1000, "Twitter Feed Block", "Twitter Feed Block", "icon-bird", Math.random() >= 0.5),
//        new NavigationItemModel(1000, "Facebook Feed Block", "Facebook Feed Block", "icon-bird", Math.random() >= 0.5),
//        new NavigationItemModel(1000, "Instagram Feed Block", "Instagram Feed Block", "icon-bird", Math.random() >= 0.5), new NavigationItemModel(1000, "Twitter Feed Block", "Twitter Feed Block", "icon-bird", Math.random() >= 0.5),
//        new NavigationItemModel(1000, "Facebook Feed Block", "Facebook Feed Block", "icon-bird", Math.random() >= 0.5),
//        new NavigationItemModel(1000, "Instagram Feed Block", "Instagram Feed Block", "icon-bird", Math.random() >= 0.5), new NavigationItemModel(1000, "Twitter Feed Block", "Twitter Feed Block", "icon-bird", Math.random() >= 0.5),
//        new NavigationItemModel(1000, "Facebook Feed Block", "Facebook Feed Block", "icon-bird", Math.random() >= 0.5),
//        new NavigationItemModel(1000, "Instagram Feed Block", "Instagram Feed Block", "icon-bird", Math.random() >= 0.5), new NavigationItemModel(1000, "Twitter Feed Block", "Twitter Feed Block", "icon-bird", Math.random() >= 0.5),
//        new NavigationItemModel(1000, "Facebook Feed Block", "Facebook Feed Block", "icon-bird", Math.random() >= 0.5),
//        new NavigationItemModel(1000, "Instagram Feed Block", "Instagram Feed Block", "icon-bird", Math.random() >= 0.5), new NavigationItemModel(1000, "Twitter Feed Block", "Twitter Feed Block", "icon-bird", Math.random() >= 0.5),
//        new NavigationItemModel(1000, "Facebook Feed Block", "Facebook Feed Block", "icon-bird", Math.random() >= 0.5),
//        new NavigationItemModel(1000, "Instagram Feed Block", "Instagram Feed Block", "icon-bird", Math.random() >= 0.5), new NavigationItemModel(1000, "Twitter Feed Block", "Twitter Feed Block", "icon-bird", Math.random() >= 0.5),
//        new NavigationItemModel(1000, "Facebook Feed Block", "Facebook Feed Block", "icon-bird", Math.random() >= 0.5),
//        new NavigationItemModel(1000, "Instagram Feed Block", "Instagram Feed Block", "icon-bird", Math.random() >= 0.5),
//    ];
//}