angular.module('n52.client.mobile')
    .controller('ListSelectionMobileButtonCtrl', ['$scope', '$uibModal',
        function($scope, $uibModal) {
            $scope.openListSelectionMobile = function() {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/mobile/modal-list-selection-mobile.html',
                    controller: 'ModalListSelectionMobileCtrl'
                });
            };
        }
    ])
    .controller('ModalListSelectionMobileCtrl', ['$scope', '$uibModalInstance',
        function($scope, $uibModalInstance) {
            $scope.modalInstance = $uibModalInstance;
            $scope.platformParams = [{
                type: 'platform',
                header: 'trajectories.headers.platform'
            }, {
                type: 'features',
                header: 'trajectories.headers.track'
            }, {
                type: 'phenomenon',
                header: 'trajectories.headers.phenomenon'
            }, {
                type: 'series',
                header: 'trajectories.headers.series'
            }];
            $scope.phenomenonParams = [{
                type: 'phenomenon',
                header: 'trajectories.headers.phenomenon'
            }, {
                type: 'features',
                header: 'trajectories.headers.track'
            }, {
                type: 'series',
                header: 'trajectories.headers.series'
            }];

            $scope.close = function() {
                $uibModalInstance.close();
            };
        }
    ])
    .controller('SwcProviderListCtrl', ['$scope', 'providerService',
        function($scope, providerService) {
            $scope.providerselected = null;

            $scope.providerList = providerService.getAllProviders();

            $scope.selectProvider = function(provider) {
                $scope.providerselected = provider;
            };
        }
    ])
    .directive('swcListSelectionMobile', [
        function() {
            return {
                restrict: 'E',
                templateUrl: 'templates/mobile/accordion-list-selection.html',
                scope: {
                    parameters: '=',
                    provider: '='
                },
                controller: 'ListSelectionMobileCtrl'
            };
        }
    ])
    .controller('ListSelectionMobileCtrl', ['$scope', 'interfaceV2Service', 'combinedSrvc',
        function($scope, interfaceV2Service, combinedSrvc) {
            var url = $scope.provider.url;
            angular.forEach($scope.parameters, function(param, openedIdx) {
                $scope.$watch('parameters[' + openedIdx + '].isOpen', function(newVal, oldVal) {
                    if (newVal) {
                        $scope.selectedParameterIndex = openedIdx;
                        angular.forEach($scope.parameters, function(param, idx) {
                            if (idx > openedIdx) {
                                param.isDisabled = true;
                                delete param.selectedId;
                                delete param.items;
                            }
                            if (idx >= openedIdx) {
                                delete param.headerAddition;
                            }
                        });
                    }
                });
            });

            $scope.createParams = function() {
                var params = {};
                angular.forEach($scope.parameters, function(parameter) {
                    if (parameter.selectedId) {
                        params[parameter.type] = parameter.selectedId;
                    }
                });
                return params;
            };

            $scope.getItems = function(currParam) {
                if (currParam.type === 'platform') {
                    interfaceV2Service.getMobilePlatforms(null, url, $scope.createParams())
                        .then(function(data) {
                            currParam.items = data;
                        })
                        .catch(function() {
                            currParam.error = true;
                        });
                } else if (currParam.type === 'features') {
                    interfaceV2Service.getFeatures(null, url, $scope.createParams())
                        .then(function(data) {
                            currParam.items = data;
                        })
                        .catch(function() {
                            currParam.error = true;
                        });
                } else if (currParam.type === 'phenomenon') {
                    interfaceV2Service.getPhenomena(null, url, $scope.createParams())
                        .then(function(data) {
                            currParam.items = data;
                        })
                        .catch(function() {
                            currParam.error = true;
                        });
                } else if (currParam.type === 'series') {
                    interfaceV2Service.getSeries(null, url, $scope.createParams())
                        .then(function(data) {
                            currParam.items = data;
                        })
                        .catch(function() {
                            currParam.error = true;
                        });
                }
            };

            $scope.openNext = function(idx) {
                $scope.parameters[idx].isDisabled = false;
                $scope.selectedParameterIndex = idx;
                $scope.parameters[idx].isOpen = true;
                $scope.getItems($scope.parameters[idx]);
            };

            $scope.openItem = function(item) {
                $scope.parameters[$scope.selectedParameterIndex].selectedId = item.id;
                $scope.parameters[$scope.selectedParameterIndex].headerAddition = item.label;
                if ($scope.selectedParameterIndex < $scope.parameters.length - 1) {
                    $scope.openNext($scope.selectedParameterIndex + 1);
                } else {
                    combinedSrvc.loadSeries(item.id, url);
                    $scope.$parent.modalInstance.close();
                }
            };

            $scope.openNext(0);
        }
    ]);
