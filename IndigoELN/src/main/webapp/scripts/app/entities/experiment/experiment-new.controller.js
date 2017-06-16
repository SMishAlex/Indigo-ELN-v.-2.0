angular.module('indigoeln').controller('ExperimentNewController',
    function ($scope, $rootScope, $stateParams, $state, $uibModalInstance, Experiment, pageInfo) {
        var vm = this;

        vm.experimentCreationTitle = 'Experiment creation';
        vm.selectTemplateText = 'Please select template for new experiment';
        vm.deleteButtonText = 'Delete';
        vm.cancelButtonText = 'Cancel';
        vm.okButtonText = 'OK';

        $scope.experiment = pageInfo.entity;
        $scope.notebookId = $stateParams.notebookId;
        $scope.projectId = $stateParams.projectId;
        $scope.templates = pageInfo.templates;
        $scope.mode = pageInfo.mode;
        $scope.template = $scope.experiment.template;

        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $rootScope.$broadcast('experiment-created', {
                projectId: $stateParams.projectId,
                notebookId: $stateParams.notebookId,
                id: result.id
            });
            $uibModalInstance.close({
                projectId: $stateParams.projectId,
                notebookId: $stateParams.notebookId,
                id: result.id
            });
        };

        var onSaveError = function () {
            $scope.isSaving = false;
        };

        function save() {
            $scope.isSaving = true;
            $scope.experiment = _.extend($scope.experiment, {template: $scope.template});
            Experiment.save({
                notebookId: $stateParams.notebookId,
                projectId: $stateParams.projectId
            }, $scope.experiment, onSaveSuccess, onSaveError);
        }

        function cancelPressed() {
            window.history.back();
            $uibModalInstance.dismiss();
        }

        $scope.ok = save;
        $scope.cancel = cancelPressed;

    });
