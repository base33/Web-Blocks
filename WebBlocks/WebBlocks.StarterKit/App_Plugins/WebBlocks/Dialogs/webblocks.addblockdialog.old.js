angular.module("umbraco")
    .controller("WebBlocks.AddBlockDialogCtrl",
    function ($scope, $timeout, $http, appState, eventsService, assetsService, dialogService) {
        var dialogOptions = $scope.dialogOptions;
        $scope.viewNavigationSource = [];
        $scope.menuLoadDelay = 0;

        $scope.templateDraggableWysiwygBlock = {
            block: {
                _type: WebBlocksType.WYSIWYG,
                id: WebBlocksUniqueIdGenerator.GenerateWysiwygId(),
                html: "<div class='umb-editor umb-rte'><umb-editor model='block.editornotes'></umb-editor></div>",
                content: "<p>Double click or right click on me to edit</p>",
                sortOrder: 10000,
                sessionId: "", //edit wysiwyg block session
                shouldRerender: true,
                element: {
                    tag: "div",
                    classes: "",
                    attrs: []
                }
            },
            shouldClone: true,
            loadContent: true,
            originBlockArray: [],
            originDraggableBlockArray: [],
            shouldRemoveFromOrigin: false
        };

        $scope.handleNavigationMore = function (navigationModel) {
            var events = [{ name: "Create", icon: "icon-add" },{ name: "Edit on page", icon: "icon-edit" }, { name: "Edit in new window", icon: "icon-folder" }];
            var eventData = { navigationModel: navigationModel };
            dialogService.open({ template: "/app_plugins/WebBlocks/Dialogs/WebBlocks.ContextMenuDialog.html", show: true, modalClass: 'wb-context-menu umb-modal', modelData: { events: events, eventData: eventData }, callback: $scope.handleNavigationAction });
        }

        $scope.handleNavigationAction = function (event) {
            if (typeof (event) == 'undefined') return;

            var navigationModel = event.eventData.navigationModel;
            switch (event.event) {
                case 'Create':
                    break;
                case 'Edit on page':
                    $scope.uiScope.ui.showIFrameEditor = true;
                    $scope.uiScope.ui.showLayoutBuilder = false;
                    $scope.uiScope.editorIframeSrc = "/umbraco/#/content/content/edit/" + navigationModel.Model.Id;
                    //$scope.submit($scope.viewNavigationSource.Model.Id);
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
        // childNavigationItems = the navigation items loaded from the api (we will create navigation view models for each, ready for the menu)
        $scope.loadChildNavigationIntoMenuCallback = function (navigationModel, childNavigationItems) {
            $timeout(function () {
                navigationModel.Children = [];
                for (var i = 0; i < childNavigationItems.length; i++) {
                    navigationModel.Children.push(new NavigationViewModel(navigationModel, childNavigationItems[i]));
                }
                $scope.viewNavigationSource.navigationModel = navigationModel;
                $scope.viewNavigationSource.show = true;
            }, $scope.menuLoadDelay);
            $scope.menuLoadDelay = 200;
        };


        $scope.onWysiwygDragComplete = function (data, event) {
            $scope.templateDraggableWysiwygBlock.id = WebBlocksUniqueIdGenerator.GenerateWysiwygId();
        };


        //models

        var NavigationViewModel = function (parent, navigationItemModel) {
            this.Parent = parent,
            this.Model = navigationItemModel,
            this.DraggableBlock = {
                block: {
                    _type: WebBlocksType.NODE,
                    id: navigationItemModel.Id,
                    name: navigationItemModel.Name,
                    html: "",
                    content: "",
                    sortOrder: 10000,
                    shouldRerender: false,
                    element: {
                        tag: "div",
                        classes: "",
                        attrs: []
                    }
                },
                shouldClone: true,
                loadContent: true,
                originBlockArray: [],
                originDraggableBlockArray: [],
                shouldRemoveFromOrigin: false
            },
            this.Children = []
        }

        var NavigationItemModel = function(id, name, contentType, iconClass, hasChildren) {
            this.Id = id,
            this.Name = name,
            this.ContentType = contentType,
            this.IconClass = iconClass,
            this.HasChildren = hasChildren
        };

        function init() {
            $scope.model = dialogOptions.modelData.rootId;
            $scope.uiScope = dialogOptions.modelData.uiScope;
            $scope.root = new NavigationViewModel(null, new NavigationItemModel($scope.model, "Root", "Null", "icon-folder", true));
            $scope.viewNavigationSource = { show: true, navigationItem: $scope.root };
            $scope.loadChildNavigationIntoMenu($scope.root)
        }

        init();
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