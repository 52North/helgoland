angular.module('n52.client.map')
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
