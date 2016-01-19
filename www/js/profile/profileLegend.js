angular.module('n52.core.profile')
        .directive('swcProfileLegend', function () {
            return {
                restrict: 'E',
                templateUrl: 'templates/profile/profile-legend.html',
                controller: ['$scope', 'profilesService',
                    function ($scope, profilesService) {
                        $scope.seriesList = profilesService.profiles;
                    }]
            };
        })
        .directive('swcProfileLegendEntry', function () {
            return {
                restrict: 'E',
                templateUrl: 'templates/profile/profile-legend-entry.html',
                scope: {
                    series: "="
                }
            };
        })
        .controller('SwcDeleteProfileLegendEntryCtrl', ['$scope', 'profilesService',
            function ($scope, profilesService) {
                $scope.removeTs = function (series) {
                    profilesService.removeProfile(series.internalId);
                };
            }]);