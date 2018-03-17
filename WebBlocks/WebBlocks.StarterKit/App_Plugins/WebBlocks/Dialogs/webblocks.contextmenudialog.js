angular.module("umbraco").controller("WebBlocks.ContextMenuDialogCtrl", function ($scope, appState, eventsService, assetsService, dialogService) {
    var dialogOptions = $scope.dialogOptions;
    $scope.model = dialogOptions.modelData;
    $scope.triggerAction = function (event) {
        var response = new WebBlocks.UI.ContextMenuResponse(event, $scope.model.eventData);
        $scope.submit(response);
    };
});
//# sourceMappingURL=webblocks.contextmenudialog.js.map