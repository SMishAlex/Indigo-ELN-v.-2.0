'use strict';

angular.module('indigoeln')
    .controller('ExperimentDetailController', function ($scope, $rootScope, $stateParams, entity, Experiment, Principal) {
        $scope.experiment = entity;
        $scope.template = entity.template;
        $scope.notebookId = $stateParams.notebookId;
        $scope.model = toModel($scope.experiment.components);
        Principal.hasAuthority('CONTENT_EDITOR').then(function (result) {
            $scope.isContentEditor = result;
        });
        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            var experimentForSave = _.extend({}, $scope.experiment, {components: toComponents($scope.model)});
            if ($scope.template != null) {
                $scope.loading = Experiment.update({
                    notebookId: $stateParams.notebookId,
                    projectId: $stateParams.projectId
                }, experimentForSave, onSaveSuccess, onSaveError).$promise;
            } else {
                $scope.loading = Experiment.save(experimentForSave, onSaveSuccess, onSaveError).$promise;
            }
        };

        function toModel(components) {
            return _.object(_.map(components, function (component) {
                return [component.name, component.content]
            }));
        }

        function toComponents(model) {
            return _.map(model, function (val, key) {
                return {name: key, content: val};
            });
        }
    });
