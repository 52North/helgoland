angular.module('n52.client.navigation', [])
    .factory('routeNavigation', ['$location', '$state',
        function($location, $state) {
            var routes = [];
            angular.forEach($state.get(), function(route) {
                if (route.name) {
                    routes.push({
                        path: route.url,
                        label: route.label,
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
