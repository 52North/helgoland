angular.module('n52.core.map')
    .controller('SwcModalStationaryRemoteCtrl', ['$scope', '$uibModalInstance', 'selection', '$location', 'fotoquestSrvc', 'seriesApiInterface',
        function($scope, $uibModalInstance, selection, $location, fotoquestSrvc, seriesApiInterface) {

            seriesApiInterface.getStationaryPlatforms(selection.id, selection.url).then(res => {
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
            this.selectedProviderUrl = '';
        }
    ])
    .controller('fotoquestViewCtrl', ['$scope', 'fotoquestSrvc', 'seriesApiInterface',
        function($scope, fotoquestSrvc, seriesApiInterface) {
            $scope.datasetId = fotoquestSrvc.selectedDatasetId;
            $scope.providerUrl = fotoquestSrvc.selectedProviderUrl;
            $scope.platformId = fotoquestSrvc.selectedPlatformId;

            seriesApiInterface.getStationaryPlatforms($scope.platformId, $scope.providerUrl).then(platform => {
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
                seriesApiInterface.getDatasets(id, $scope.providerUrl).then(dataset => {
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
        controller: ['$scope',
            function($scope) {
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
    })
    .service('fotoquestPresentDataset', ['fotoquestSrvc', '$location',
        function(fotoquestSrvc, $location) {
            this.presentDataset = function(dataset, providerUrl) {
                fotoquestSrvc.selectedPlatformId = dataset.seriesParameters.platform.id;
                fotoquestSrvc.selectedDatasetId = dataset.id;
                fotoquestSrvc.selectedProviderUrl = providerUrl;
                $location.url('/fotoquest');
            };
        }
    ])
    .service('fotoquestPlatformPresenter', ['$uibModal', 'mapService',
        function($uibModal, mapService) {
            this.presentPlatform = function(platform) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/map/stationary-remote-platform.html',
                    resolve: {
                        selection: function() {
                            var url = platform.url;
                            var phenomenonId;
                            if (mapService.map.selectedPhenomenon) {
                                angular.forEach(mapService.map.selectedPhenomenon.provider, function(provider) {
                                    if (url === provider.url)
                                        phenomenonId = provider.phenomenonID;
                                });
                            }
                            return {
                                id: platform.id,
                                phenomenonId: phenomenonId,
                                url: url
                            };
                        }
                    },
                    controller: 'SwcModalStationaryRemoteCtrl'
                });
            };
        }
    ]);
