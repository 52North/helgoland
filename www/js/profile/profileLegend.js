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
                $scope.removeProfile = function (series) {
                    profilesService.removeProfile(series.internalId);
                };
            }])
        .controller('SwcToggleProfileLegendEntryCtrl', ['$scope', 'profilesService',
            function ($scope, profilesService) {
                $scope.isToggled = profilesService.isProfileToggled($scope.series.internalId);
                $scope.toggleProfile = function (series) {
                    profilesService.toggleProfile(series.internalId);
                    $scope.isToggled = profilesService.isProfileToggled(series.internalId);
                };
            }])
        .controller('SwcToggleSelectionProfileLegendEntryCtrl', ['$scope', 'profilesService',
            function ($scope, profilesService) {
                $scope.isSelectionToggled = profilesService.isProfileSelectionToggled($scope.series.internalId);
                $scope.toggleSelection = function (series) {
                    profilesService.toggleProfileSelection(series.internalId);
                    $scope.isSelectionToggled = profilesService.isProfileSelectionToggled(series.internalId);
                };
            }])
        .controller('SwcColorSelectionProfileLegendEntryCtrl', ['$scope', 'profilesService',
            function ($scope, profilesService) {
                $scope.isSelectionToggled = profilesService.isProfileSelectionToggled($scope.series.internalId);
                $scope.toggleSelection = function (series) {
                    profilesService.toggleProfileSelection(series.internalId);
                    $scope.isSelectionToggled = profilesService.isProfileSelectionToggled(series.internalId);
                };
            }]);