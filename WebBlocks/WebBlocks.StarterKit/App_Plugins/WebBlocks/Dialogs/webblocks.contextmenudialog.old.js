angular.module("umbraco")
    .controller("WebBlocks.ContextMenuDialogCtrl",
    function ($scope, appState, eventsService, assetsService, dialogService) {
        var dialogOptions = $scope.dialogOptions;
        $scope.model = dialogOptions.modelData;

        $scope.triggerAction = function (event) {
            var eventResponse = {
                event: event,
                eventData: $scope.model.eventData
            };
            $scope.submit(eventResponse);
        };
    });