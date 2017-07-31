(function() {
    angular
        .module('indigoeln')
        .directive('indigoComponents', indigoComponents);

    /* @ngInject */
    function indigoComponents($timeout) {
        var scrollCache = {};

        return {
            restrict: 'E',
            replace: true,
            scope: {
                template: '=',
                isReadonly: '=',
                model: '=',
                experiment: '=',
                experimentForm: '=',
                saveExperimentFn: '&',
                onChanged: '&'
            },
            link: link,
            templateUrl: 'scripts/components/entities/template/components/components-templete/components.html',
            bindToController: true,
            controllerAs: 'vm',
            controller: indigoComponentsController
        };

        /* @ngInject */
        function link(scope, element) {
            if (!scope.experiment) {
                return;
            }
            var id = scope.experiment.fullId;
            var tc;
            var preventFirstScroll;
            $timeout(function() {
                tc = element.find('.tab-content');
                if (scrollCache[id]) {
                    setTimeout(function() {
                        nostore = true;
                        tc[0].scrollTop = scrollCache[id];
                    }, 100);
                }
                var stimeout,
                    nostore;
                tc.on('scroll', function(e) {
                    // will close some dropdowns EPMLSOPELN-437
                    element.trigger('click');
                    if (nostore) {
                        nostore = false;

                        return;
                    }
                    if (!preventFirstScroll) {
                        scrollCache[id] = this.scrollTop;
                    } else {
                        nostore = true;
                        tc[0].scrollTop = scrollCache[id] || 0;
                    }
                    clearTimeout(stimeout);
                    stimeout = setTimeout(function() {
                        preventFirstScroll = true;
                    }, 300);
                    preventFirstScroll = false;
                    nostore = false;
                });
            }, 100);
        }

        /* @ngInject */
        function indigoComponentsController($scope, ProductBatchSummaryOperations) {
            var vm = this;

            init();

            function init() {
                vm.batches = null;
                vm.batchesTrigger = 0;
                vm.selectedBatch = null;
                vm.selectedBatchTrigger = 0;
                vm.reactants = null;
                vm.reactantsTrigger = 0;

                vm.onAddedBatch = onAddedBatch;
                vm.onSelectBatch = onSelectBatch;
                vm.onRemoveBatches = onRemoveBatches;
                vm.onPrecursorsChanged = onPrecursorsChanged;
                vm.onChangedComponent = onChangedComponent;
                bindEvents();
            }

            function onChangedComponent(componentId) {
                vm.onChanged({componentId: componentId});
            }

            function updateModel() {
                vm.batches = _.get(vm.model, 'productBatchSummary.batches') || [];
                vm.compounds = _.get(vm.model, 'preferredCompoundSummary.compounds') || [];
                vm.batchesTrigger++;

                updateSelections();
            }

            function updateSelections() {
                if ((vm.batches.length && !vm.selectedBatch) || (vm.compounds.length && !vm.selectedCompound)) {
                    updateSelectedBatch();
                }
            }

            function bindEvents() {
                $scope.$watch('vm.model', updateModel);
            }

            function updateSelectedBatch() {
                var selectedBatch = vm.model && vm.model.productBatchDetails ?
                    _.find(vm.batches, {nbkBatch: _.get(vm.model, 'productBatchDetails.nbkBatch')}) :
                    _.first(vm.batches);

                onSelectBatch(selectedBatch || null);
            }

            function onRemoveBatches(batchesForRemove) {
                var length = vm.batches.length;

                ProductBatchSummaryOperations.deleteBatches(vm.batches, batchesForRemove);

                if (vm.batches.length - length) {
                    vm.onChanged();
                    vm.batchesTrigger++;
                }

                if (vm.selectedBatch && !_.includes(vm.batches, vm.selectedBatch)) {
                    onSelectBatch(_.first(vm.batches));
                }
            }

            function onAddedBatch(batch) {
                vm.batches.push(batch);
                vm.batchesTrigger++;
            }

            function onSelectBatch(batch) {
                vm.selectedBatch = batch;
                vm.selectedBatchTrigger++;
            }

            function onPrecursorsChanged(precursors) {
                $timeout(function() {
                    _.forEach(vm.batches, function(batch) {
                        batch.precursors = precursors;
                    });
                });
            }
        }
    }
})();
