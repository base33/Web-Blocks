angular.module("umbraco").controller("WebBlocks.RecycleBinDialogCtrl", function ($scope, appState, eventsService, assetsService, dialogService, contentResource) {
    var dialogOptions = $scope.dialogOptions;
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
    $scope.deleteAllBlocks = function () {
        if (confirm("Are you sure you wish to delete all blocks?")) {
            emptyArray($scope.draggableBlockArray);
            emptyArray($scope.dialogOptions.modelData);
        }
    };
    $scope.deleteBlock = function (draggableBlock) {
        if (confirm("Are you sure you wish to delete this block?")) {
            removeFromArray(dialogOptions.modelData, draggableBlock.Block);
            removeFromArray($scope.draggableBlockArray, draggableBlock);
        }
    };
    syncDraggableBlockArray();
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