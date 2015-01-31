angular.module("umbraco").controller("WebBlocks.RecycleBinDialogCtrl", function ($scope, appState, eventsService, assetsService, dialogService, contentResource) {
    var dialogOptions = $scope.dialogOptions;
    var recycleBinContext = dialogOptions.modelData;
    $scope.recycleBinBlockArray = [];
    $scope.deletedTemplateBlocks = [];
    loadAddDeletedTemplateBlocks();
    syncRecycleBinBlockArray();
    $scope.getWysiwygContent = function (block) {
        var text = "";
        if (block instanceof WebBlocks.LayoutBuilder.WysiwygBlock) {
            text = $(block.Content).text();
            text = text.substr(0, Math.min(text.length, 100));
        }
        return text;
    };
    $scope.deleteAllBlocks = function () {
        if (confirm("Are you sure you wish to delete all blocks?")) {
            emptyArray($scope.recycleBinBlockArray);
            emptyArray(recycleBinContext.RecycleBinBlocks);
        }
    };
    $scope.deleteBlock = function (recycleBinBlock) {
        if (confirm("Are you sure you wish to delete this block?")) {
            removeFromArray(recycleBinContext.RecycleBinBlocks, recycleBinBlock.RecycleBinBlock);
            removeFromArray($scope.recycleBinBlockArray, recycleBinBlock);
        }
    };
    $scope.restoreBlock = function (deletedTemplateBlock) {
        if (confirm(deletedTemplateBlock.Block.Name + "will be restored back in to container: " + deletedTemplateBlock.Container.Name + ". Would you like to continue?")) {
            deletedTemplateBlock.Block.IsDeletedBlock = false;
            removeFromArray($scope.deletedTemplateBlocks, deletedTemplateBlock);
        }
    };
    function syncRecycleBinBlockArray() {
        $scope.draggableBlockArray = [];
        for (var i = 0; i < recycleBinContext.RecycleBinBlocks.length; i++) {
            var recycleBinBlock = recycleBinContext.RecycleBinBlocks[i];
            var recycleBinBlockViewModel = new WebBlocks.UI.Dialogs.RecycleBinItemViewModel();
            recycleBinBlockViewModel.RecycleBinBlock = recycleBinBlock;
            recycleBinBlockViewModel.DraggableBlock = {
                Block: recycleBinBlock.Block,
                BlockIconClass: "icon-folder",
                ShouldClone: false,
                OnDropCallback: getOnDropCallback(recycleBinBlockViewModel)
            };
            //display the correct up-to-date name and icon
            LoadContent(recycleBinBlockViewModel.DraggableBlock);
            $scope.recycleBinBlockArray.push(recycleBinBlockViewModel);
        }
    }
    function getOnDropCallback(recycleBinBlockViewModel) {
        return function (draggableBlock) {
            removeFromArray($scope.recycleBinBlockArray, recycleBinBlockViewModel);
            removeFromArray(recycleBinContext.RecycleBinBlocks, recycleBinBlockViewModel.RecycleBinBlock);
        };
    }
    function LoadContent(draggableBlock) {
        if (draggableBlock.Block instanceof WebBlocks.LayoutBuilder.NodeBlock) {
            contentResource.getById(draggableBlock.Block.Id).then(function (content) {
                draggableBlock.Block.Name = content.name;
                draggableBlock.BlockIconClass = content.icon;
            });
        }
    }
    function loadAddDeletedTemplateBlocks() {
        $scope.deletedTemplateBlocks = [];
        angular.forEach(recycleBinContext.Containers, function (container, containerName) {
            for (var i = 0; i < container.Blocks.length; i++) {
                var block = container.Blocks[i];
                if (block.IsTemplateBlock && block.IsDeletedBlock) {
                    var deletedTemplateBlockModel = new WebBlocks.UI.Dialogs.DeletedTemplateBlockModel(block, container);
                    LoadContent(deletedTemplateBlockModel);
                    $scope.deletedTemplateBlocks.push(deletedTemplateBlockModel);
                }
            }
        });
    }
    //empties an array
    function emptyArray(arr) {
        while (arr.length > 0) {
            arr.pop();
        }
    }
    //removes an item from an array
    function removeFromArray(arr, item) {
        var i;
        while ((i = arr.indexOf(item)) !== -1) {
            arr.splice(i, 1);
        }
    }
});
//# sourceMappingURL=layoutbuilder.recyclebindialog.js.map