import 'n52-sensorweb-client-core/src/js/selection/station-map-selector/component';
import 'n52-sensorweb-client-core/src/js/selection/service-filter-selector/component';

angular.module('n52.core.timeseries')
    .component('swcTimeseriesMapSelectionView', {
        template: require('../../../templates/timeseries/timeseries-map-selection-view.html'),
        controller: ['providerSelection', 'settingsService', '$uibModal',
            function(providerSelection, settingsService, $uibModal) {
                var defaultPlatformTypes = 'stationary';
                var defaultValueTypes = 'quantity';

                var updateStationFilter = (serviceId, phenomenonId) => {
                    this.stationFilter = {
                        platformTypes: defaultPlatformTypes,
                        valueTypes: defaultValueTypes,
                        service: serviceId
                    };
                    if (phenomenonId) this.stationFilter.phenomenon = phenomenonId;
                };

                var updatePhenomenonFilter = () => {
                    this.phenomenonFilter = {
                        platformTypes: defaultPlatformTypes,
                        valueTypes: defaultValueTypes,
                        service: providerSelection.selectedProvider.id
                    };
                };

                this.layers = {
                    baselayers: settingsService.baselayer,
                    overlays: settingsService.overlays
                };
                this.cluster = true;

                this.$onInit = () => {
                    this.selectedProvider = providerSelection.selectedProvider;
                    updateStationFilter(providerSelection.selectedProvider.id);
                    updatePhenomenonFilter(providerSelection.selectedProvider.id);
                };

                this.phenomenonSelected = (phenomenon) => {
                    this.selectedPhenomenon = phenomenon;
                    updateStationFilter(providerSelection.selectedProvider.id, phenomenon.id);
                };

                this.deselectPhenomenon = () => {
                    this.selectedPhenomenon = null;
                    updateStationFilter(providerSelection.selectedProvider.id);
                };

                this.stationSelected = (station) => {
                    $uibModal.open({
                        animation: true,
                        templateUrl: 'n52.core.map.station',
                        resolve: {
                            selection: () => {
                                var params = {
                                    stationId: station.properties.id,
                                    url: this.selectedProvider.providerUrl
                                };
                                if (this.selectedPhenomenon && this.selectedPhenomenon.id) params.phenomenonId = this.selectedPhenomenon.id;
                                return params;
                            }
                        },
                        controller: ['$scope', '$uibModalInstance', 'timeseriesService', '$state', 'stationService', 'selection', 'seriesApiInterface',
                            function($scope, $uibModalInstance, timeseriesService, $state, stationService, selection, seriesApiInterface) {
                                $scope.station = {};

                                seriesApiInterface.getStations(selection.stationId, selection.url, {
                                    phenomenon: selection.phenomenonId
                                }).then(function(result) {
                                    $scope.station.entry = result;
                                    if (selection.phenomenonId) {
                                        for (var entry in result.properties.timeseries) {
                                            if (result.properties.timeseries.hasOwnProperty(entry)) {
                                                if (result.properties.timeseries[entry].phenomenon
                                                    && result.properties.timeseries[entry].phenomenon.id !== selection.phenomenonId) {
                                                    delete result.properties.timeseries[entry];
                                                }
                                            }
                                        }
                                    }
                                    angular.forEach(result.properties.timeseries, function(timeseries) {
                                        timeseries.selected = true;
                                    });
                                });

                                $scope.isAllSelected = !stationService.preselectFirstTimeseries;
                                $scope.serviceUrl = selection.url;

                                $scope.toggleAll = function() {
                                    angular.forEach($scope.station.entry.properties.timeseries, function(ts) {
                                        ts.selected = $scope.isAllSelected;
                                    });
                                };

                                $scope.close = function() {
                                    $uibModalInstance.close();
                                };

                                $scope.toggled = function() {
                                    var allSelected = true;
                                    angular.forEach($scope.station.entry.properties.timeseries, function(ts) {
                                        if (!ts.selected)
                                            allSelected = false;
                                    });
                                    $scope.isAllSelected = allSelected;
                                };

                                $scope.addTimeseriesSelection = function() {
                                    angular.forEach($scope.station.entry.properties.timeseries, function(timeseries) {
                                        if (timeseries.selected) {
                                            timeseriesService.addTimeseriesById(timeseries.id, selection.url);
                                        }
                                    });
                                    $state.go('timeseries.diagram');
                                    $uibModalInstance.close();
                                };
                            }
                        ]
                    });
                };
            }
        ]
    });
