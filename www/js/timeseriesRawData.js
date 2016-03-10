angular.module('n52.core.rawDataOutput', [])
        .directive('swcTimeseriesRawDataOutput', [function () {
                return {
                    restrict: "E",
                    replace: true,
                    scope: {
                        timeseries: "="
                    },
                    templateUrl: "templates/output/timeseries-rawdata-output.html",
                    controller: 'SwcTimeseriesRawDataOutputCtrl'
                };
            }])
        .controller('SwcTimeseriesRawDataOutputCtrl', ['$scope', '$window', 'timeseriesRawDataOutputSrv', 'timeService', 'utils',
            function ($scope, $window, timeseriesRawDataOutputSrv, timeService, utils) {
                $scope.formatsList = [];

                $scope.select = function (choice) {
                    var timespan = timeService.time;
                    var timespanString = utils.createRequestTimespan(timespan.start, timespan.end);
                    var url = $scope.timeseries.apiUrl + "timeseries/" + $scope.timeseries.id + "/getData?rawFormat=" + choice + "&timespan=" + encodeURIComponent(timespanString);
                    $window.open(url);
                };

                $scope.toggled = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                };

                timeseriesRawDataOutputSrv.getSupportedRawFormats($scope.timeseries, $scope.formatsList);
            }])
        .factory('timeseriesRawDataOutputSrv', ['interfaceService', function (interfaceService) {
                function getSupportedRawFormats(timeseries, list) {
                    angular.forEach(timeseries.rawFormats, function (format) {
                        list.push(format);
                    });
                }
                return {
                    getSupportedRawFormats: getSupportedRawFormats
                };
            }]);