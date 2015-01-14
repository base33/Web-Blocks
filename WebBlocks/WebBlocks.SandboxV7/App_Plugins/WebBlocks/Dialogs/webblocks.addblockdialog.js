angular.module("umbraco")
    .controller("WebBlocks.AddBlockDialogCtrl",
    function ($scope, appState, eventsService, assetsService, dialogService) {
        var dialogOptions = $scope.dialogOptions;
        $scope.model = dialogOptions.modelData;
    });