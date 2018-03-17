angular.module("umbraco")
    .controller("WebBlocks.ContextMenuDialogCtrl", function ($scope, appState, eventsService, assetsService, dialogService) {
    var dialogOptions = $scope.dialogOptions;
    $scope.model = dialogOptions.modelData;
    $scope.triggerAction = function (event) {
        var response = new WebBlocks.UI.Dialogs.ContextMenuResponse(event, $scope.model.EventData);
        $scope.submit(response);
    };
});
//# sourceMappingURL=layoutbuilder.contextmenudialog.js.map