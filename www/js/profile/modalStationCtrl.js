angular.module('n52.core.profile')
        .controller('SwcModalStationProfileCtrl', ['$scope', '$uibModalInstance', 'timeseriesService', 'profilesService', 'stationService', 'selection', '$location',
            function ($scope, $uibModalInstance, timeseriesService, profilesService, stationService, selection, $location) {
                stationService.determineTimeseries(selection.station, selection.url);
                $scope.isAllSelected = true;
                $scope.station = stationService.station;
                $scope.phenomenonId = selection.phenomenonId;

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
                    angular.forEach($scope.station.entry.properties.timeseries, function (series) {
                        if (series.selected && (!phenomenonId || series.phenomenon.id === phenomenonId)) {
                            switch (series.type) {
                                case 'profile': 
                                    profilesService.addProfiles(series);
                                    $location.url('/profiles');
                                    break;
                                default: 
                                    timeseriesService.addTimeseriesById(series.id, selection.url);
                                    $location.url('/diagram');
                            }
                        }
                    });
                    $uibModalInstance.close();
                };
            }]);