angular.module('n52.client.navigation', [])
    .factory('routeNavigation', ['$route', '$location', function($route, $location) {
        var routes = [];
        angular.forEach($route.routes, function(route, path) {
            if (route.name) {
                routes.push({
                    path: path,
                    name: route.name,
                    modal: route.modal
                });
            }
        });
        return {
            routes: routes,
            activeRoute: function(route) {
                return route.path === $location.path();
            }
        };
    }])
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
