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
                fotoquestSrvc.selectedDatasetId = datasetId;
                fotoquestSrvc.selectedProviderUrl = selection.url;
                $location.url('/fotoquest');
                $scope.close();
            };
        }
    ])
    .service('fotoquestSrvc', [
        function() {
            this.selectedDatasetId = ''; // record_8012712
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
        controller: ['interfaceService',
            function(interfaceService) {
                var ctrl = this;
                interfaceService.getDatasets(ctrl.datasetid, ctrl.providerurl)
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
                        });
                    });
                };
            }
        ]
    });
