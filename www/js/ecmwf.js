angular.module('n52.core.map')
    .service('ecmwfPlatformPresenter', ['$uibModal', 'mapService',
        function($uibModal, mapService) {
            this.presentPlatform = function(platform) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/ecmwf/stationary-insitu-ecmwf.html',
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
                    controller: 'SwcModalEcmwfCtrl'
                });
            };
        }
    ])
    .controller('SwcModalEcmwfCtrl', [
        '$scope',
        '$uibModalInstance',
        'selection',
        'seriesApiInterface',
        'serviceFinder',
        function(
            $scope,
            $uibModalInstance,
            selection,
            seriesApiInterface,
            serviceFinder
        ) {
            $scope.serviceUrl = selection.url;

            seriesApiInterface.getPlatforms(selection.id, selection.url)
                .then((platform) => {
                    $scope.platform = platform;
                    seriesApiInterface.getPlatformExtras(selection.id, selection.url, {
                            fields: 'parents'
                        })
                        .then((result) => {
                            $scope.parentProcedures = result.parents.procedures;
                        });
                    if (platform.datasets.length > 0) {
                        seriesApiInterface.getDatasetExtras(platform.datasets[0].id, selection.url, {
                                fields: 'resultTimes'
                            })
                            .then((result) => {
                                $scope.resultTimes = result.resultTimes;
                            });
                    }
                });

            $scope.close = function() {
                $uibModalInstance.close();
            };

            $scope.selectProcedure = function(item) {
                $scope.selectedProcedure = item;
            };

            $scope.selectResultTime = function(item) {
                $scope.selectedResultTime = item;
                $scope.datasets = [];
                seriesApiInterface.getDatasets(null, selection.url, {
                    platforms: selection.id,
                    procedures: $scope.selectedProcedure.id
                }).then((datasets) => {
                    $scope.datasets = datasets;
                    $scope.datasets.forEach(entry => {
                        seriesApiInterface.getDatasets(entry.id, selection.url, {
                                resultTime: $scope.selectedResultTime
                            })
                            .then(dataset => {
                                dataset.selected = true;
                                angular.extend(entry, dataset);
                            });
                    });
                });
            };

            $scope.toggled = function() {
                var allSelected = true;
                angular.forEach($scope.platform.datasets, function(dataset) {
                    if (!dataset.selected)
                        allSelected = false;
                });
                $scope.isAllSelected = allSelected;
            };

            $scope.presentSelection = function() {
                angular.forEach($scope.datasets, (dataset) => {
                    dataset.filter = {
                        resultTime: $scope.selectedResultTime
                    };
                    if (dataset.selected && (!selection.phenomenonId || dataset.seriesParameters.phenomenon.id === selection.phenomenonId)) {
                        serviceFinder
                            .getDatasetPresenter(dataset.valueType, dataset.seriesParameters.platform.platformType, selection.url)
                            .presentDataset(dataset, selection.url);
                    }
                });
                $scope.close();
            };
        }
    ])
    .component('swcEcmwfProcedureSelection', {
        bindings: {
            items: '<',
            onSelect: '&'
        },
        templateUrl: 'n52.ecmwf.map.procedure-selection',
        controller: ['seriesApiInterface', 'utils',
            function(seriesApiInterface, utils) {
                this.$onInit = function() {};

                this.onChange = function(item) {
                    this.onSelect({
                        item: this.selection
                    });
                };
            }
        ]
    })
    .component('swcEcmwfResultTimeSelection', {
        bindings: {
            items: '<',
            onSelect: '&'
        },
        templateUrl: 'n52.ecmwf.map.result-time-selection',
        controller: [
            function() {
                this.onChange = function(item) {
                    this.onSelect({
                        item: this.selection
                    });
                };
            }
        ]
    })
    .component('swcEcmwfLegend', {
        bindings: {
            items: '<'
        },
        templateUrl: 'n52.ecmwf.legend',
        controller: ['timeseriesService', 'seriesApiInterface',
            function(timeseriesService, seriesApiInterface) {

                this.$doCheck = function() {
                    if (Object.keys(this.items).length !== this.previousCount) {
                        this.createEntries();
                        this.previousCount = Object.keys(this.items).length;
                    }
                };

                this.createEntries = function() {
                    this.entries = [];
                    for (var key in this.items) {
                        if (this.items.hasOwnProperty(key)) {
                            // if (this.items[key].apiUrl.startsWith('http://192.168.52.128:8080/52n-sos-webapp/api/')) {
                                var platformID = this.items[key].seriesParameters.platform.id;
                                var resultTime = this.items[key].filter.resultTime;
                                this.addToEntries(this.items[key], platformID, resultTime);
                            // } else {
                            //     this.entries.push(this.items[key]);
                            // }
                        }
                    }
                };

                this.addToEntries = function(item, platformID, resultTime) {
                    seriesApiInterface.getProcedures(item.seriesParameters.procedure.id, item.apiUrl)
                        .then((procedure) => {
                            var parentProcedureLabel = procedure.parents[0].label;
                            // find entry
                            var added = false;
                            this.entries.forEach((entry) => {
                                if (entry.ecmwfGroup &&
                                    entry.platformID === platformID &&
                                    entry.resultTime === resultTime &&
                                    entry.parentProcedureLabel === parentProcedureLabel) {
                                    entry.items.push(item);
                                    added = true;
                                }
                            });
                            // create new entry
                            if (!added) {
                                this.entries.push({
                                    ecmwfGroup: true,
                                    platformID: platformID,
                                    resultTime: resultTime,
                                    parentProcedureLabel: parentProcedureLabel,
                                    items: [item]
                                });
                            }
                        });
                };
            }
        ]
    })
    .component('swcEcmwfLegendEntry', {
        bindings: {
            item: '<'
        },
        templateUrl: 'n52.ecmwf.legend-entry',
        controller: ['styleService', 'timeseriesService', 'locateStationService', '$location',
            function(styleService, timeseriesService, locateStationService, $location) {

                this.toggleSelection = function() {
                    this.item.items.forEach((entry) => {
                        styleService.toggleSelection(entry);
                    });
                };

                this.toggleVisibility = function() {
                    this.item.items.forEach((entry) => {
                        styleService.toggleTimeseriesVisibility(entry);
                    });
                };

                this.removeAll = function() {
                    this.item.items.forEach((entry) => {
                        timeseriesService.removeTimeseries(entry.internalId);
                    });
                };

                this.showInMap = function() {
                    locateStationService.showPlatform('mapService', this.item.items[0]);
                    $location.url('/map');
                };

                this.toggled = function(entry) {
                    styleService.triggerStyleUpdate(entry);
                };
            }
        ]
    })
    .config(['$provide',
        function($provide) {
            $provide.decorator('utils', ['$delegate', '$q', '$http',
                function($delegate, $q, $http) {
                    $delegate.oldCreateInternalId = $delegate.createInternalId;
                    $delegate.createInternalId = function(ts) {
                        if (ts.filter && ts.filter.resultTime) {
                            return $delegate.oldCreateInternalId(ts) + ts.filter.resultTime;
                        }
                        return $delegate.oldCreateInternalId(ts);
                    };
                    return $delegate;
                }
            ]);
        }
    ]);
