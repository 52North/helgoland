angular.module('n52.client.navigation', [])
    .factory('routeNavigation', ['$location', '$state', 'settingsService',
        function($location, $state, settingsService) {
            var addRoute = (route) => {
                if (route.label) {
                    routes.push({
                        path: route.url,
                        label: route.label,
                        modal: route.modal
                    });
                }
            };

            var routes = [];
            if (settingsService.menuItems) {
                settingsService.menuItems.forEach(entry => {
                    addRoute($state.get(entry));
                });
            } else {
                angular.forEach($state.get(), function(route) {
                    addRoute(route);
                });
            }

            return {
                routes: routes,
                activeRoute: function(route) {
                    return $location.path().startsWith(route.path);
                }
            };
        }
    ])
    .directive('navigation', ['routeNavigation', function(routeNavigation) {
        return {
            restrict: "E",
            replace: true,
            template: require("../templates/menu/navigation.html"),
            controller: ['$scope', '$location', '$uibModal', function($scope, $location, $uibModal) {
                $scope.routes = routeNavigation.routes;
                $scope.activeRoute = routeNavigation.activeRoute;
                $scope.open = function(modal) {
                    if (modal) {
                        $location.url($location.url());
                        $uibModal.open({
                            animation: true,
                            template: modal.template,
                            controller: modal.controller
                        });
                    }
                };
            }]
        };
    }])
    // switch to map view after new provider is selected
    .config(['$provide',
        function($provide) {
            $provide.decorator('providerService', ['$delegate', '$location',
                function($delegate, $location) {
                    $delegate.oldSelectProvider = $delegate.selectProvider;
                    $delegate.selectProvider = function(selection) {
                        $delegate.oldSelectProvider(selection);
                        $location.url('/map');
                    };
                    return $delegate;
                }
            ]);
        }
    ]);
