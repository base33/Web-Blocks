angular.module("umbraco")
    .controller("WebBlocks.BlockStorageDialogCtrl",
    function ($scope, appState, eventsService, assetsService, dialogService, contentTypeResource) {

        var dialogOptions = $scope.dialogOptions;
        $scope.draggableBlockArray = [];

        $scope.getWysiwygContent = function (draggableBlock) {
            var text = "";
            var block = draggableBlock.Block;
            if (block._type == WebBlocksType.WYSIWYG) {
                text = $(block.Content).text();
                text = text.substr(0, Math.min(text.length, 100));
            }
            return text;
        }


        

        syncDraggableBlockArray();

        function syncDraggableBlockArray() {
            $scope.draggableBlockArray = [];
            //prepare the draggable block array ready for display.
            //this model is what is dragged on to pages, so we need it to be in the format the container expects it
            for (var i = 0; i < dialogOptions.modelData.length; i++) {
                var block = dialogOptions.modelData[i];
                //contentTypeResource.getContentType(block.Id)
                //.then(function (type) {
                //    console.log(type);
                //});
                //block = block that is being dragged
                //blockArrays = block arrays the block currently exists
                //shouldRemoveFromOrigin = flag whether the container should remove it from this array
                $scope.draggableBlockArray.push({ Block: dialogOptions.modelData[i], OriginBlockArray: [dialogOptions.modelData], OriginDraggableBlockArray: [$scope.draggableBlockArray], ShouldRemoveFromOrigin: true, ShouldClone: false, LoadContent: true })
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