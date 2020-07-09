angular.module("umbraco")
    .controller("WebBlocks.BlockStorageDialogCtrl", function ($scope, appState, eventsService, assetsService, dialogService, contentTypeResource, contentResource) {
    var dialogOptions = $scope.dialogOptions;
    var originBlockStorageList = $scope.dialogOptions.modelData;
    $scope.blockStorageArray = [];
    $scope.getWysiwygContent = function (draggableBlock) {
        var text = "";
        var block = draggableBlock.Block;
        if (block instanceof WebBlocks.LayoutBuilder.WysiwygBlock) {
            text = $(block.Content).text();
            text = text.substr(0, Math.min(text.length, 100));
        }
        return text;
    };
    function syncBlockStorageArray() {
        $scope.blockStorageArray = [];
        for (var i = 0; i < dialogOptions.modelData.length; i++) {
            var blockStorageBlock = dialogOptions.modelData[i];
            var blockStorageItemViewModel = new WebBlocks.UI.Dialogs.BlockStorageItemViewModel();
            blockStorageItemViewModel.BlockStorageBlock = blockStorageBlock;
            blockStorageItemViewModel.DraggableBlock = {
                Block: blockStorageBlock.Block, ShouldClone: false, LoadContent: true, BlockIconClass: "icon-folder",
                OnDropCallback: getOnDropCallback(blockStorageItemViewModel)
            };
            //display the correct up-to-date name and icon
            LoadContent(blockStorageBlock.Block, blockStorageItemViewModel.DraggableBlock);
            $scope.blockStorageArray.push(blockStorageItemViewModel);
        }
    }
    function getOnDropCallback(blockStorageItemViewModel) {
        return function (draggableBlock) {
            removeFromArray($scope.blockStorageArray, blockStorageItemViewModel);
            removeFromArray(originBlockStorageList, blockStorageItemViewModel.BlockStorageBlock);
        };
    }
    function LoadContent(block, draggableBlock) {
        if (block instanceof WebBlocks.LayoutBuilder.NodeBlock) {
            contentResource.getById(block.Id).then(function (content) {
                block.Name = content.name;
                draggableBlock.BlockIconClass = content.icon;
            });
        }
    }
    function removeFromArray(arr, item) {
        var i;
        while ((i = arr.indexOf(item)) !== -1) {
            arr.splice(i, 1);
        }
    }
    syncBlockStorageArray();
});
//# sourceMappingURL=layoutbuilder.blockstoragedialog.js.map