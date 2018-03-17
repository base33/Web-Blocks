angular.module("umbraco")
    .controller("WebBlocks.RecycleBinDialogCtrl",
    function ($scope, appState, eventsService, assetsService, dialogService) {

        var dialogOptions = $scope.dialogOptions;
        $scope.draggableBlockArray = [];

        $scope.getWysiwygContent = function (draggableBlock) {
            var text = "";
            var block = draggableBlock.block;
            if (block._type == WebBlocksType.WYSIWYG) {
                text = $(block.content).text();
                text = text.substr(0, Math.min(text.length, 100));
            }
            return text;
        }

        $scope.deleteAllBlocks = function () {
            if (confirm("Are you sure you wish to delete all blocks?")) {
                emptyArray($scope.draggableBlockArray);
                emptyArray($scope.dialogOptions.modelData);
            }
        }

        $scope.deleteBlock = function (draggableBlock) {
            if (confirm("Are you sure you wish to delete this block?")) {
                removeFromArray(dialogOptions.modelData, draggableBlock.block);
                removeFromArray($scope.draggableBlockArray, draggableBlock);
            }
        }

        syncDraggableBlockArray();

        function syncDraggableBlockArray() {
            $scope.draggableBlockArray = [];
            for (var i = 0; i < dialogOptions.modelData.length; i++) {
                $scope.draggableBlockArray.push({ block: dialogOptions.modelData[i], originBlockArray: [dialogOptions.modelData], originDraggableBlockArray: [$scope.draggableBlockArray], shouldRemoveFromOrigin: true })
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

        $scope.triggerAction = function (event) {
            var eventResponse = {
                event: event,
                eventData: $scope.model.eventData
            };
            $scope.submit(eventResponse);
        };
    });