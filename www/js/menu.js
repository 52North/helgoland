angular.module('n52.client.menu', []).provider('Menu',
        function () {
            var _menu = [];
            this.$get = function () {
                return {
                    getItems: function () {
                        return _menu;
                    }
                };
            };
            this.add = function (item) {
                _menu.push(item);
            };
        })
        .directive('n52Menu', [function () {
                return {
                    restrict: 'E',
                    templateUrl: 'templates/menu/menu.html',
                    scope: {
                    },
                    controller: ['$scope', 'Menu', function ($scope, Menu) {
                            $scope.menu = Menu.getItems();
                        }]
                };
            }])
        .directive('n52MenuEntry', ['$compile', '$location', function ($compile, $location) {
                return {
                    restrict: 'E',
                    templateUrl: 'templates/menu/menu-entry.html',
                    scope: {},
                    link: function (scope, elem, attrs) {
                        scope.entry = angular.fromJson(attrs.entry);
                        scope.isTarget = function (entry) {
                            return entry.url === $location.path();
                        };
                        if (scope.entry.target)
                            elem.children().attr('href', scope.entry.target);
                        if (scope.entry.controller)
                            elem.children().attr('ng-controller', scope.entry.controller);
                        if (scope.entry.click)
                            elem.children().attr('ng-click', scope.entry.click);
                        elem.removeAttr('entry');
                        $compile(elem.children())(scope);
                    }
                };
            }])
        .controller('LayerControlCtrl', ['$scope', function ($scope) {
                angular.extend($scope, {
                    layercontrol: {
                        icons: {
                            uncheck: "glyphicon glyphicon-unchecked",
                            check: "glyphicon glyphicon-check",
                            radio: "glyphicon glyphicon-check",
                            unradio: "glyphicon glyphicon-unchecked"
                        }
                    }
                });
            }]);
