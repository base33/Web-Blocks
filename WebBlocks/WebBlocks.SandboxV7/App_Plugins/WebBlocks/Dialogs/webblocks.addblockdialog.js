angular.module("umbraco")
    .controller("WebBlocks.AddBlockDialogCtrl",
    function ($scope, appState, eventsService, assetsService, dialogService) {
        var dialogOptions = $scope.dialogOptions;
        $scope.viewNavigationSource = [];

        $scope.handleClick = function () {
            alert("click");
        }

        $scope.handleNavigationMore = function (navigationModel) {
            var events = [{ name: "Create", icon: "icon-add" },{ name: "Edit on page", icon: "icon-edit" }, { name: "Edit in new window", icon: "icon-folder" }];
            var eventData = { navigationModel: navigationModel };
            dialogService.open({ template: "/app_plugins/WebBlocks/Dialogs/WebBlocks.ContextMenuDialog.html", show: true, modalClass: 'wb-context-menu umb-modal', modelData: { events: events, eventData: eventData }, callback: $scope.handleNavigationAction });
        }

        $scope.handleNavigationAction = function (event) {
            var navigationModel = event.eventData.navigationModel;
            switch (event.event) {
                case 'Create':
                    break;
                case 'Edit on page':
                    $scope.uiScope.ui.showIFrameEditor = true;
                    $scope.uiScope.ui.showLayoutBuilder = false;
                    $scope.uiScope.editorIframeSrc = "/umbraco/#/content/content/edit/" + navigationModel.Model.Id;
                    $scope.submit($scope.viewNavigationSource.Model.Id);
                    break;
                case 'Edit in new window':
                    window.open("/umbraco/#/content/content/edit/" + navigationModel.Model.Id, "_blank");
                    break;
            }
        };

        $scope.getBreadcrumb = function (navigationModel) {
            var breadcrumb = "";
            if(navigationModel.Parent != null)
                breadcrumb = $scope.getBreadcrumb(navigationModel.Parent);
            breadcrumb = (breadcrumb + (navigationModel.Parent != null ? " > " : "") + navigationModel.Model.Name);
            return (breadcrumb.length > 80 ? ".." : "") + breadcrumb.substr(breadcrumb.length - Math.min(80, breadcrumb.length));
        };

        $scope.loadChildNavigationIntoMenu = function (navigationModel) {
            var childNavigationItems = getChildNavigationItems(navigationModel.Model.Id);
            $scope.viewNavigationSource = {};
            setTimeout(function () { }, 2000);
            for (var i = 0; i < childNavigationItems.length; i++) {
                navigationModel.Children.push(new NavigationViewModel(navigationModel, childNavigationItems[i]));
            }
            $scope.viewNavigationSource = navigationModel;
        };


        function getChildNavigationItems(sourceId) {
            return [new NavigationItemModel(1000, "Twitter Feed Block", "Twitter Feed Block", "icon-bird", Math.random() >= 0.5),
                new NavigationItemModel(1000, "Facebook Feed Block", "Facebook Feed Block", "icon-bird", Math.random() >= 0.5),
                new NavigationItemModel(1000, "Instagram Feed Block", "Instagram Feed Block", "icon-bird", Math.random() >= 0.5), new NavigationItemModel(1000, "Twitter Feed Block", "Twitter Feed Block", "icon-bird", Math.random() >= 0.5),
                new NavigationItemModel(1000, "Facebook Feed Block", "Facebook Feed Block", "icon-bird", Math.random() >= 0.5),
                new NavigationItemModel(1000, "Instagram Feed Block", "Instagram Feed Block", "icon-bird", Math.random() >= 0.5), new NavigationItemModel(1000, "Twitter Feed Block", "Twitter Feed Block", "icon-bird", Math.random() >= 0.5),
                new NavigationItemModel(1000, "Facebook Feed Block", "Facebook Feed Block", "icon-bird", Math.random() >= 0.5),
                new NavigationItemModel(1000, "Instagram Feed Block", "Instagram Feed Block", "icon-bird", Math.random() >= 0.5), new NavigationItemModel(1000, "Twitter Feed Block", "Twitter Feed Block", "icon-bird", Math.random() >= 0.5),
                new NavigationItemModel(1000, "Facebook Feed Block", "Facebook Feed Block", "icon-bird", Math.random() >= 0.5),
                new NavigationItemModel(1000, "Instagram Feed Block", "Instagram Feed Block", "icon-bird", Math.random() >= 0.5), new NavigationItemModel(1000, "Twitter Feed Block", "Twitter Feed Block", "icon-bird", Math.random() >= 0.5),
                new NavigationItemModel(1000, "Facebook Feed Block", "Facebook Feed Block", "icon-bird", Math.random() >= 0.5),
                new NavigationItemModel(1000, "Instagram Feed Block", "Instagram Feed Block", "icon-bird", Math.random() >= 0.5), new NavigationItemModel(1000, "Twitter Feed Block", "Twitter Feed Block", "icon-bird", Math.random() >= 0.5),
                new NavigationItemModel(1000, "Facebook Feed Block", "Facebook Feed Block", "icon-bird", Math.random() >= 0.5),
                new NavigationItemModel(1000, "Instagram Feed Block", "Instagram Feed Block", "icon-bird", Math.random() >= 0.5),
            ];
        }

        

        var NavigationViewModel = function (parent, navigationItemModel) {
            this.Parent = parent,
            this.Model = navigationItemModel,
            this.positionClass = "";
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
            $scope.viewNavigationSource = [];
            $scope.loadChildNavigationIntoMenu($scope.root)
        }

        init();
    });