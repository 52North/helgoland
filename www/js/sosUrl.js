angular.module('n52.core.sosMetadata', [])
        .directive('swcSosUrl', [function () {
                return {
                    restrict: "E",
                    replace: true,
                    scope: {
                        timeseries: "="
                    },
                    templateUrl: "templates/output/sos-url.html",
                    controller: 'SwcSosUrlCtrl'
                };
            }])
        .controller('SwcSosUrlCtrl', ['$scope', 'sosUrlSrv', '$window',
            function ($scope, sosUrlSrv, $window) {
                $scope.sos = {};
                $scope.openCapabilities = function() {
                    $window.open($scope.sos.url + '?request=GetCapabilities&service=SOS');
                };
                sosUrlSrv.getSosUrl($scope.timeseries, $scope.sos);
            }])
        .factory('sosUrlSrv', ['interfaceService', function (interfaceService) {
                function getSosUrl(timeseries, sos) {
                    var id = timeseries.parameters.service.id,
                            apiUrl = timeseries.apiUrl;
                    interfaceService.getServices(apiUrl, id).then(function (service) {
                        if (service.type === 'SOS') {
                            sos.url = service.serviceUrl;
                        }
                    });
                }
                return {
                    getSosUrl: getSosUrl
                };
            }]);