import 'n52-sensorweb-client-core/src/js/selection/station-map-selector/component';
import 'n52-sensorweb-client-core/src/js/selection/service-filter-selector/component';

angular.module('n52.core.timeseries')
    .component('swcTimeseriesMapSelectionView', {
        template: require('../../../templates/timeseries/timeseries-map-selection-view.html'),
        controller: ['providerSelection', 'settingsService', '$uibModal',
            function(providerSelection, settingsService, $uibModal) {

                this.layers = {
                    baselayers: settingsService.baselayer,
                    overlays: settingsService.overlays
                };
                this.cluster = true;

                this.$onInit = () => {
                    this.selectedProvider = providerSelection.selectedProvider;
                    this.stationFilter = {};
                };

                this.phenomenonSelected = (phenomenon) => {
                    this.selectedPhenomenon = phenomenon;
                    this.stationFilter = {
                        phenomenon: phenomenon.id
                    };
                };

                this.deselectPhenomenon = () => {
                    this.selectedPhenomenon = null;
                    this.stationFilter = {};
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
                        controller: ['$scope', '$uibModalInstance', 'timeseriesService', '$state', 'stationService', 'selection',
                            function ($scope, $uibModalInstance, timeseriesService, $state, stationService, selection) {
                                stationService.determineTimeseries(selection.stationId, selection.url);
                                $scope.isAllSelected = !stationService.preselectFirstTimeseries;
                                $scope.station = stationService.station;
                                $scope.phenomenonId = selection.phenomenonId;
                                $scope.serviceUrl = selection.url;

                                $scope.toggleAll = function () {
                                    angular.forEach($scope.station.entry.properties.timeseries, function (ts) {
                                        ts.selected = $scope.isAllSelected;
                                    });
                                };

                                $scope.close = function () {
                                    $uibModalInstance.close();
                                };

                                $scope.toggled = function () {
                                    var allSelected = true;
                                    angular.forEach($scope.station.entry.properties.timeseries, function (ts) {
                                        if (!ts.selected)
                                            allSelected = false;
                                    });
                                    $scope.isAllSelected = allSelected;
                                };

                                $scope.addTimeseriesSelection = function (phenomenonId) {
                                    angular.forEach($scope.station.entry.properties.timeseries, function (timeseries) {
                                        if (timeseries.selected && (!phenomenonId || timeseries.phenomenon.id === phenomenonId)) {
                                            timeseriesService.addTimeseriesById(timeseries.id, selection.url);
                                        }
                                    });
                                    $state.go('timeseries.diagram');
                                    $uibModalInstance.close();
                                };
                            }]
                    });
                };
            }
        ]
    });
