angular.module('listSelectionModule_mobile', [])
        .controller('ListSelectionMobileButtonCtrl', ['$scope', '$uibModal',
            function ($scope, $uibModal) {
                $scope.openListSelectionMobile = function () {
                    $uibModal.open({
                        animation: true,
                        templateUrl: 'templates/mobile/modal-list-selection-mobile.html',
                        controller: 'ModalListSelectionMobileCtrl'
                    });
                };
            }])
        .controller('ModalListSelectionMobileCtrl', ['$scope', '$uibModalInstance',
            function ($scope, $uibModalInstance) {
                $scope.modalInstance = $uibModalInstance;
                $scope.shipParams = [
                    {
                        type: 'platform',
                        header: 'listSelection_mobile.headers.ship'
                    },
                    {
                        type: 'track',
                        header: 'listSelection_mobile.headers.track'
                    },
                    {
                        type: 'phenomenon',
                        header: 'listSelection_mobile.headers.phenomenon'
                    }
                ];
                $scope.phenomenonParams = [
                    {
                        type: 'phenomenon',
                        header: 'listSelection_mobile.headers.phenomenon'
                    },
                    {
                        type: 'track',
                        header: 'listSelection_mobile.headers.track'
                    }
                ];

                $scope.close = function () {
                    $uibModalInstance.close();
                };
            }])
        .controller('SwcProviderListCtrl', ['$scope', 'providerService',
            function ($scope, providerService) {
                $scope.providerselected = false;
                
                $scope.providerList = providerService.providerList;

                $scope.selectProvider = function (provider) {
                    $scope.providerselected = true;
                    providerService.selectProvider(provider);
                    $scope.providerList = providerService.providerList;
                };
            }])

        .directive('swcListSelectionMobile', [
            function () {
                return {
                    restrict: 'E',
                    templateUrl: 'templates/mobile/accordion-list-selection.html',
                    scope: {
                        parameters: '='
                    },
                    controller: 'ListSelectionMobileCtrl'
                };
            }])
        .controller('ListSelectionMobileCtrl', ['$scope', 'mobileInterfaceService', 'mobilemapService', 'colorService', 'statusService', 'interfaceService', 'utils',
            function ($scope, mobileInterfaceService, mobilemapService, colorService, statusService, interfaceService, utils) {
                var url = statusService.status.apiProvider.url;
                angular.forEach($scope.parameters, function (param, openedIdx) {
                    $scope.$watch('parameters[' + openedIdx + '].isOpen', function (newVal, oldVal) {
                        if (newVal) {
                            $scope.selectedParameterIndex = openedIdx;
                            // TODO nachfolger disablen und zurücksetzen
                            angular.forEach($scope.parameters, function (param, idx) {
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

                $scope.createParams = function () {
                    var params = {};
//                    var params = {
//                        service: statusService.status.apiProvider.serviceID
//                    };
                    angular.forEach($scope.parameters, function (parameter) {
                        if (parameter.selectedId) {
                            params[parameter.type] = parameter.selectedId;
                        }
                    });
                    return params;
                };

                $scope.getItems = function (currParam) {
                    if (currParam.type === 'platform') {
                        mobileInterfaceService.getMobilePlatforms(null, url, $scope.createParams()).then(function (data) {
                            currParam.items = data;
                        });
                    } else if (currParam.type === 'track') {
                        mobileInterfaceService.getTracks(null, url, $scope.createParams()).then(function (data) {
                            currParam.items = data;
                        });
                    } else if (currParam.type === 'phenomenon') {
                        interfaceService.getPhenomena(null, url, $scope.createParams()).then(function (data) {
                            currParam.items = data;
                        });
                    }
                };

                $scope.openNext = function (idx) {
                    $scope.parameters[idx].isDisabled = false;
                    $scope.selectedParameterIndex = idx;
                    $scope.parameters[idx].isOpen = true;
                    $scope.getItems($scope.parameters[idx]);
                };

                $scope.openItem = function (item) {
                    $scope.parameters[$scope.selectedParameterIndex].selectedId = item.id;
                    $scope.parameters[$scope.selectedParameterIndex].headerAddition = item.label;
                    if ($scope.selectedParameterIndex < $scope.parameters.length - 1) {
                        $scope.openNext($scope.selectedParameterIndex + 1);
                    } else {
                        interfaceService.getTimeseries(null, url, $scope.createParams()).then(function (s) {
                            var series = s[0];
                            var timespan = utils.createRequestTimespan(series.firstValue.timestamp, series.lastValue.timestamp);
                            interfaceService.getTsData(series.id, url, timespan, $scope.createParams()).then(function (data) {
                                mobilemapService.clearPaths();
                                mobilemapService.clearMarker();
                                createPath(series, data);
                                createMarkers(series, data);
                            });
                        });
                        $scope.$parent.modalInstance.close();
                    }
                };

                createPath = function (timeseries, data) {
                    var latlngs = [];
                    angular.forEach(data[timeseries.id].values, function (point) {
                        latlngs.push({
                            lat: point[3],
                            lng: point[2]
                        });
                    });
                    mobilemapService.addPath(timeseries.id, {
                        color: colorService.getColor(timeseries.id),
                        weight: 4,
                        latlngs: latlngs
                    }, true);
                };

                createMarkers = function (timeseries, data) {
                    angular.forEach(data[timeseries.id].values, function (point, idx) {
                        var time = point[0];
                        var value = point[1];
                        var uom = timeseries.uom;
                        var phenomenon = timeseries.parameters.phenomenon.label;
                        mobilemapService.addMarker('marker' + idx, {
                            latlngs: {
                                lat: point[3],
                                lng: point[2]
                            },
                            radius: 5,
                            color: '#FF0000',
                            message: phenomenon + ': ' + value + ' ' + uom + ' | ' + moment.unix(time / 1000).format('DD.MM.YY HH:mm')
                        });
                    });
                };

                $scope.openNext(0);
            }])
        .service('mobileInterfaceService', ['$http', '$q',
            function ($http, $q) {

                var _createRequestConfigs = function (params) {
//                    if (angular.isUndefined(params)) {
//                        params = settingsService.additionalParameters;
//                    } else {
//                        angular.extend(params, settingsService.additionalParameters);
//                    }
                    return {
                        params: params,
                        cache: true
                    };
                };

                var _createIdString = function (id) {
                    return (id === null ? "" : "/" + id);
                };

                this.getMobilePlatforms = function (id, apiUrl, params) {
                    if (angular.isUndefined(params))
                        params = {};
                    params.type = 'mobile';
                    return $q(function (resolve, reject) {
                        $http.get(apiUrl + 'platforms' + _createIdString(id), _createRequestConfigs(params)).then(function (response) {
                            resolve(response.data.platforms);
                        });
                    });
                };

                this.getTracks = function (id, apiUrl, params) {
                    return $q(function (resolve, reject) {
                        $http.get(apiUrl + 'features' + _createIdString(id), _createRequestConfigs(params)).then(function (response) {
                            resolve(response.data.features);
                        });
                    });
                };
            }]);