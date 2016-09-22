angular.module('n52.core.map')
    .controller('SwcModalStationaryRemoteCtrl', ['$scope', '$uibModalInstance', 'selection', '$location', 'fotoquestSrvc', 'interfaceService',
        function($scope, $uibModalInstance, selection, $location, fotoquestSrvc, interfaceService) {

            interfaceService.getStationaryPlatforms(selection.id, selection.url).then(res => {
                $scope.platform = res;
            });

            $scope.close = function() {
                $uibModalInstance.close();
            };

            $scope.showDataset = function(datasetId) {
                fotoquestSrvc.selectedPlatformId = selection.id;
                fotoquestSrvc.selectedDatasetId = datasetId;
                fotoquestSrvc.selectedProviderUrl = selection.url;
                $location.url('/fotoquest');
                $scope.close();
            };
        }
    ])
    .service('fotoquestSrvc', [
        function() {
            this.selectedPlatformId = '';
            this.selectedDatasetId = '';
            this.selectedProviderUrl = 'http://localhost:8080/api/v1/';
        }
    ])
    .controller('fotoquestViewCtrl', ['$scope', 'fotoquestSrvc', 'interfaceService',
        function($scope, fotoquestSrvc, interfaceService) {
            $scope.datasetId = fotoquestSrvc.selectedDatasetId;
            $scope.providerUrl = fotoquestSrvc.selectedProviderUrl;
            $scope.platformId = fotoquestSrvc.selectedPlatformId;

            interfaceService.getStationaryPlatforms($scope.platformId, $scope.providerUrl).then(platform => {
                $scope.platform = platform;
            });

            requestDataset($scope.datasetId);

            $scope.showNextImagery = function() {
                var idx = getDatasetIdx() + 1;
                if (idx > $scope.platform.datasets.length - 1) idx = 0;
                requestDataset($scope.platform.datasets[idx].id);
            };

            $scope.showPreviousImagery = function() {
                var idx = getDatasetIdx() - 1;
                if (idx < 0) idx = $scope.platform.datasets.length - 1;
                requestDataset($scope.platform.datasets[idx].id);
            };

            function requestDataset(id) {
                interfaceService.getDatasets(id, $scope.providerUrl).then(dataset => {
                    $scope.dataset = dataset;
                });
            }

            function getDatasetIdx() {
                var idx;
                $scope.platform.datasets.forEach((entry, i) => {
                    if (entry.id === $scope.dataset.id) {
                        idx = i;
                    }
                });
                return idx;
            }
        }
    ])
    .component('fotoquestImageCarousel', {
        templateUrl: 'templates/fotoquest/imageCarousel.html',
        bindings: {
            dataset: '<'
        },
        controller: ['interfaceService', '$scope',
            function(interfaceService, $scope) {
                var ctrl = this;

                this.$onChanges = function(changesObj) {
                    if (changesObj.dataset) {
                        if (changesObj.dataset.currentValue) {
                            var dataset = changesObj.dataset.currentValue;
                            if (dataset.firstValue.timestamp === dataset.lastValue.timestamp) {
                                createImageArray(dataset.firstValue.value);
                            }
                        }
                    }
                };

                createImageArray = function(value) {
                    ctrl.images = [];
                    var keys = Object.keys(value);
                    keys.forEach(key => {
                        ctrl.images.push({
                            label: key,
                            url: value[key].properties.href
                        });
                    });
                };
            }
        ]
    });
