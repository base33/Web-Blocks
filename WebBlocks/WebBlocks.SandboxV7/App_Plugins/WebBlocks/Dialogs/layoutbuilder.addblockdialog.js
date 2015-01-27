angular.module("umbraco").controller("WebBlocks.AddBlockDialogCtrl", function ($scope, $timeout, $http, appState, eventsService, assetsService, dialogService) {
    var dialogOptions = $scope.dialogOptions;
    $scope.viewNavigationSource = [];
    $scope.menuLoadDelay = 0;
    $scope.templateDraggableWysiwygBlock = createDraggableWysiwygBlock();
    $scope.handleNavigationMore = function (navigationModel) {
        var contextMenu = new WebBlocks.UI.Dialogs.ContextMenu([{ Name: "Create", IconClass: "icon-add" }, { Name: "Edit on page", IconClass: "icon-edit" }, { Name: "Edit in new window", IconClass: "icon-folder" }], { navigationModel: navigationModel });
        dialogService.open(WebBlocks.UI.Dialogs.DialogOptionsFactory.BuildContextMenuDialogOptions(contextMenu, $scope.handleNavigationAction));
    };
    $scope.handleNavigationAction = function (event) {
        if (typeof (event) == 'undefined')
            return;
        var navigationModel = event.EventData.navigationModel;
        switch (event.Event) {
            case 'Create':
                break;
            case 'Edit on page':
                var rootUIState = $scope.uiScope.ui;
                rootUIState.IframeEditor.Visible = true;
                rootUIState.LayoutBuilder.Visible = false;
                rootUIState.IframeEditor.Url = "/umbraco/#/content/content/edit/" + navigationModel.Model.Id;
                break;
            case 'Edit in new window':
                window.open("/umbraco/#/content/content/edit/" + navigationModel.Model.Id, "_blank");
                break;
        }
    };
    $scope.loadChildNavigationIntoMenu = function (navigationModel) {
        $scope.viewNavigationSource.show = false;
        //load the children from the API
        var webBlocksApiClient = new WebBlocksApiClient($http);
        webBlocksApiClient.GetNavigationChildren(navigationModel.Model.Id, function (childNavigationItems) {
            // call the callback function
            $scope.loadChildNavigationIntoMenuCallback(navigationModel, childNavigationItems);
        });
    };
    // navigationModel = the navigation view model which will be the new root of the menu
    // childNavigationItems = the navigation items loaded from the api (we will create navigation meta data models for each, ready for the menu)
    $scope.loadChildNavigationIntoMenuCallback = function (navigationModel, childrenToLoad) {
        $timeout(function () {
            navigationModel.Children = [];
            for (var i = 0; i < childrenToLoad.length; i++) {
                navigationModel.Children.push(createChildNavigationModel(navigationModel, childrenToLoad[i]));
            }
            $scope.viewNavigationSource.navigationModel = navigationModel;
            $scope.viewNavigationSource.show = true;
        }, $scope.menuLoadDelay);
        $scope.menuLoadDelay = 200;
    };
    $scope.onWysiwygDragComplete = function (data, event) {
        $scope.templateDraggableWysiwygBlock.Block.Id = WebBlocks.Utils.MathHelper.GenerateRandomNumber(10000, 52000);
    };
    function createChildNavigationModel(parent, model) {
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
        $scope.loadChildNavigationIntoMenu($scope.root);
    }
    init();
    function createRootNavigationViewModel(rootId) {
        var nvm = new WebBlocks.UI.Dialogs.NavigationViewModel();
        nvm.Model = new WebBlocks.UI.Dialogs.NavigationViewModelViewData(rootId, "Root", "Null", "icon-folder", true);
        nvm.Children = new Array();
        return nvm;
    }
    function createDraggableNodeBlock(nodeId, nodeName) {
        var draggableBlock = new WebBlocks.UI.DraggableBlockModel();
        draggableBlock.Block = createNodeBlock(nodeId, nodeName);
        draggableBlock.LoadContent = true;
        draggableBlock.ShouldClone = true;
        draggableBlock.ShouldRemoveFromOrigin = false;
        return draggableBlock;
    }
    function createNodeBlock(nodeId, nodeName) {
        var block = new WebBlocks.LayoutBuilder.NodeBlock();
        block.Id = nodeId;
        block.Name = nodeName;
        block.SortOrder = 10000;
        return block;
    }
    function createDraggableWysiwygBlock() {
        var draggableBlock = new WebBlocks.UI.DraggableBlockModel();
        draggableBlock.Block = createWysiwygBlock();
        draggableBlock.LoadContent = false;
        draggableBlock.ShouldClone = true;
        draggableBlock.ShouldRemoveFromOrigin = false;
        return draggableBlock;
    }
    function createWysiwygBlock() {
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
//# sourceMappingURL=layoutbuilder.addblockdialog.js.map