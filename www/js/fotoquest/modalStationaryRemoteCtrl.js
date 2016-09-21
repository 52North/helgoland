angular.module('n52.core.map')
    .controller('SwcModalStationaryRemoteCtrl', ['$scope', '$uibModalInstance', 'selection', '$location', 'fotoquestSrvc', 'interfaceV2Service',
        function($scope, $uibModalInstance, selection, $location, fotoquestSrvc, interfaceV2Service) {

            interfaceV2Service.getStationaryPlatforms(selection.id, selection.url).then(res => {
                $scope.platform = res;
            });

            $scope.close = function() {
                $uibModalInstance.close();
            };

            $scope.showDataset = function(datasetId) {
                fotoquestSrvc.selectedDatasetId = datasetId;
                fotoquestSrvc.selectedProviderUrl = selection.url;
                $location.url('/fotoquest');
                $scope.close();
            }
        }
    ])
    .service('fotoquestSrvc', [
        function() {
            this.selectedDatasetId = '';
            this.selectedProviderUrl = 'http://localhost:8080/api/v1/';
        }
    ])
    .controller('fotoquestViewCtrl', ['$scope', 'fotoquestSrvc',
        function($scope, fotoquestSrvc) {
            $scope.datasetId = fotoquestSrvc.selectedDatasetId;
            $scope.providerUrl = fotoquestSrvc.selectedProviderUrl;
        }
    ])
    .component('fotoquestImageCarousel', {
        templateUrl: 'templates/fotoquest/imageCarousel.html',
        bindings: {
            datasetid: '<',
            providerurl: '<'
        },
        controller: ['interfaceV2Service',
            function(interfaceV2Service) {
                var ctrl = this;
                interfaceV2Service.getDatasets(ctrl.datasetid, ctrl.providerurl)
                    .then(result => {
                        ctrl.dataset = result;
                        if (result.firstValue.timestamp === result.lastValue.timestamp) {
                            createImageArray(result.firstValue.value);
                            ctrl.timestamp = result.firstValue.timestamp;
                            ctrl.label = result.label;
                        }
                    });

                createImageArray = function(value) {
                    ctrl.images = [];
                    var keys = Object.keys(value);
                    keys.forEach(key => {
                        ctrl.images.push({
                            label: key,
                            url: value[key].properties.href
                        })
                    });
                }
            }
        ]
    });
