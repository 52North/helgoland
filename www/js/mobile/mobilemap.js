angular.module('n52.client.mobileMap', ['listSelectionModule_mobile'])
        .controller("MobileMapController", ['$scope', 'mobilemapService',
          function ($scope, mobilemapService) {
            $scope.map = mobilemapService.map;
          }])
        .factory('mobilemapService', ['mapHelper', function (mapHelper) {
            var map = {};
            var data = {};

            var init = function () {
              map.markers = {};
              map.paths = {};
              map.popup = {};
              map.bounds = {
                address: 'Münster'
              };
              map.layers = {
                baselayers: {
                  osm: {
                    name: 'OpenStreetMap',
                    type: 'xyz',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    layerOptions: {
                      showOnSelector: false
                    }
                  }
                }
              };
            };

            var addPath = function (id, path, zoomTo) {
              map.paths[id] = path;
              map.bounds = mapHelper.createBounds(path.latlngs);
            };

            var clearPaths = function () {
              map.paths = {};
            };

            var addMarker = function (id, marker) {
              var newMarker = angular.merge({
                type: "circleMarker",
                color: '#000',
                fillColor: '#000',
                fill: true,
                radius: 10,
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
              }, marker);
              map.paths[id] = newMarker;
            };

            var clearMarker = function () {
              map.markers = {};
            };

            init();
            return {
              map: map,
              data: data,
              addPath: addPath,
              clearPaths: clearPaths,
              addMarker: addMarker,
              clearMarker: clearMarker
            };
          }]);

            
