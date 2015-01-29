angular.module("umbraco")
    .controller("WebBlocks.AddBlockDialogCtrl",
    function ($scope, $timeout, $http, appState, eventsService, assetsService, dialogService) {
        var dialogOptions = $scope.dialogOptions;
        $scope.viewNavigationSource = [];
        $scope.menuLoadDelay = 0;

        $scope.templateDraggableWysiwygBlock = createDraggableWysiwygBlock();

        $scope.handleNavigationMore = function (navigationModel: WebBlocks.UI.Dialogs.NavigationViewModel) {
            var contextMenu = new WebBlocks.UI.Dialogs.ContextMenu(
                [{ Name: "Create", IconClass: "icon-add" }, { Name: "Edit on page", IconClass: "icon-edit" }, { Name: "Edit in new window", IconClass: "icon-folder" }],
                { navigationModel: navigationModel }
            );
            dialogService.open(WebBlocks.UI.Dialogs.DialogOptionsFactory.BuildContextMenuDialogOptions(contextMenu, $scope.handleNavigationAction));
        }

        $scope.handleNavigationAction = function (event: WebBlocks.UI.Dialogs.ContextMenuResponse) {
            if (typeof (event) == 'undefined') return;

            var navigationModel = <WebBlocks.UI.Dialogs.NavigationViewModel>event.EventData.navigationModel;
            switch (event.Event) {
                case 'Create':
                    break;
                case 'Edit on page':
                    var rootUIState = <WebBlocks.UI
                        .UIState>$scope.uiScope.ui;
                    rootUIState.IframeEditor.Visible = true;
                    rootUIState.LayoutBuilder.Visible = false;
                    rootUIState.IframeEditor.Url = "/umbraco/#/content/content/edit/" + navigationModel.Model.Id;
                    break;
                case 'Edit in new window':
                    window.open("/umbraco/#/content/content/edit/" + navigationModel.Model.Id, "_blank");
                    break;
            }
        };

        $scope.loadChildNavigationIntoMenu = function (navigationModel : WebBlocks.UI.Dialogs.NavigationViewModel) {
            $scope.viewNavigationSource.show = false;

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
            }, $scope.menuLoadDelay);
            $scope.menuLoadDelay = 200;
        };


        $scope.onWysiwygDragComplete = function (data, event) {
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
            $scope.model = dialogOptions.modelData.rootId;
            $scope.uiScope = dialogOptions.modelData.uiScope;
            $scope.root = createRootNavigationViewModel($scope.model);
            $scope.viewNavigationSource = { show: true, navigationItem: $scope.root };
            $scope.loadChildNavigationIntoMenu($scope.root)
        }

        init();

        function createRootNavigationViewModel(rootId: number): WebBlocks.UI.Dialogs.NavigationViewModel {
            var nvm = new WebBlocks.UI.Dialogs.NavigationViewModel();
            nvm.Model = new WebBlocks.API.Models.NavigationItem(rootId, "Root", "Null", "icon-folder", true);
            nvm.Children = new Array<WebBlocks.UI.Dialogs.NavigationViewModel>();
            return nvm;
        }
        
        function createDraggableNodeBlock(nodeId: number, nodeName: string) : WebBlocks.UI.DraggableBlockModel {
            var draggableBlock = new WebBlocks.UI.DraggableBlockModel();
            draggableBlock.Block = createNodeBlock(nodeId, nodeName);
            draggableBlock.LoadContent = true;
            draggableBlock.ShouldClone = true;
            draggableBlock.ShouldRemoveFromOrigin = false;
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
            draggableBlock.ShouldRemoveFromOrigin = false;
            return draggableBlock;
        }

        function createWysiwygBlock() : WebBlocks.LayoutBuilder.WysiwygBlock {
            var block = new WebBlocks.LayoutBuilder.WysiwygBlock();
            block.Id = WebBlocks.Utils.MathHelper.GenerateRandomNumber(10000, 52000);
            block.Name = "Wysiwyg Block";
            block.SortOrder = 1000;
            block.Content = "<p>Double click or right click on me to edit</p>";
            block.ViewModel.Html = "<p>Double click or right click on me to edit</p>";
            return block;
        }
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