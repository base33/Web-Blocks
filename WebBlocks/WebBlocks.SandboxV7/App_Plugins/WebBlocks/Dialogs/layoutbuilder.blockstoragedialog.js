angular.module("umbraco").controller("WebBlocks.BlockStorageDialogCtrl", function ($scope, appState, eventsService, assetsService, dialogService, contentTypeResource, contentResource) {
    var dialogOptions = $scope.dialogOptions;
    var blockList = $scope.dialogOptions.modelData;
    $scope.draggableBlockArray = [];
    $scope.getWysiwygContent = function (draggableBlock) {
        var text = "";
        var block = draggableBlock.Block;
        if (block instanceof WebBlocks.LayoutBuilder.WysiwygBlock) {
            text = $(block.Content).text();
            text = text.substr(0, Math.min(text.length, 100));
        }
        return text;
    };
    function syncDraggableBlockArray() {
        $scope.draggableBlockArray = [];
        for (var i = 0; i < dialogOptions.modelData.length; i++) {
            var block = dialogOptions.modelData[i];
            var draggableBlock = { Block: block, OriginBlockArray: dialogOptions.modelData, OriginDraggableBlockArray: $scope.draggableBlockArray, ShouldRemoveFromOrigin: true, BlockIconClass: "icon-folder" };
            //display the correct up-to-date name and icon
            LoadContent(block, draggableBlock);
            $scope.draggableBlockArray.push(draggableBlock);
        }
    }
    function LoadContent(block, draggableBlock) {
        if (block instanceof WebBlocks.LayoutBuilder.NodeBlock) {
            contentResource.getById(block.Id).then(function (content) {
                block.Name = content.name;
                draggableBlock.BlockIconClass = content.icon;
            });
        }
    }
    syncDraggableBlockArray();
});
//# sourceMappingURL=layoutbuilder.blockstoragedialog.js.map