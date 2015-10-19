angular.module('mobilemapModule',
        ['leaflet-directive',
            'n52.core.interface',
            'n52.core.status',
            'listSelectionModule_mobile'])
        .controller("MobileMapController", ['$scope', 'mobilemapService', function ($scope, mobilemapService) {
                $scope.map = mobilemapService.map;
//                $scope.data = mobilemapService.data;
//                $scope.loadData = function (id) {
//                    mobilemapService.loadTrack(id);
//                };
            }])
        .factory('mobilemapService', ['$http', function ($http) {
                var map = {};
                var data = {};

                var init = function () {
                    map.markers = {};
                    map.paths = {};
                    map.popup = {};
                    map.bounds = {};
                    map.center = {lat: 52, lng: 7, zoom: 7};
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

                var loadTrack = function (id) {
                    $http.get("track_" + id + ".json").then(function (response) {
                        newmap(response.data[id], id);
                    });
                };

                var newmap = function (mapdata, id) {
                    angular.copy({}, map.paths);
                    map.center = {
                        lat: mapdata.points[0].coordinates[1],
                        lng: mapdata.points[0].coordinates[0],
                        zoom: 7
                    };
                    map.paths = {
                        p1: {
                            color: '#008000',
                            weight: 8,
                            latlngs: [
                                {lat: mapdata.points[0].coordinates[1], lng: mapdata.points[0].coordinates[0]},
                                {lat: mapdata.points[1].coordinates[1], lng: mapdata.points[1].coordinates[0]},
                                {lat: mapdata.points[2].coordinates[1], lng: mapdata.points[2].coordinates[0]},
                                {lat: mapdata.points[3].coordinates[1], lng: mapdata.points[2].coordinates[0]},
                                {lat: mapdata.points[4].coordinates[1], lng: mapdata.points[2].coordinates[0]}
                            ]
                        }
                    };
                };
//                $http.get("data/platform.json").then(function (response) {
//                    data.platform = response.data;
//                });

//                var requestStations = function (phenomenon) {
//                    var params;
//                    if (statusService.status.concentrationMarker && phenomenon) {
//                        params = {
//                            service: statusService.status.apiProvider.serviceID,
//                            phenomenon: phenomenon,
//                            expanded: true,
//                            force_latest_values: true,
//                            status_intervals: true
//                        };
//                        interfaceService.getTimeseries(null, statusService.status.apiProvider.url, params).success(createMarkers);
//                    } else {
//                        params = {
//                            service: statusService.status.apiProvider.serviceID,
//                            phenomenon: phenomenon
//                        };
//                        interfaceService.getStations(null, statusService.status.apiProvider.url, params).success(createMarkers);
//                    }
//                };

//                var createMarkers = function (data) {
//                    angular.copy({}, map.markers);
//                    angular.copy({}, map.paths);
//                    angular.copy({}, map.bounds);
//                    if (data.length > 0) {
//                        var firstElemCoord = getCoordinates(data[0]);
//                        var topmost = firstElemCoord[1];
//                        var bottommost = firstElemCoord[1];
//                        var leftmost = firstElemCoord[0];
//                        var rightmost = firstElemCoord[0];
//                        $.each(data, $.proxy(function (n, elem) {
//                            var geom = getCoordinates(elem);
//                            if (!isNaN(geom[0]) || !isNaN(geom[1])) {
//                                if (geom[0] > rightmost) {
//                                    rightmost = geom[0];
//                                }
//                                if (geom[0] < leftmost) {
//                                    leftmost = geom[0];
//                                }
//                                if (geom[1] > topmost) {
//                                    topmost = geom[1];
//                                }
//                                if (geom[1] < bottommost) {
//                                    bottommost = geom[1];
//                                }
//                                if (statusService.status.concentrationMarker && isTimeseries(elem)) {
//                                    addColoredCircle(geom, elem);
//                                } else {
//                                    addNormalMarker(geom, elem);
//                                }
//                            }
//                        }, this));
//                        angular.copy(leafletBoundsHelpers.createBoundsFromArray([
//                            [parseFloat(bottommost), parseFloat(leftmost)],
//                            [parseFloat(topmost), parseFloat(rightmost)]]), map.bounds);
//                    }
//                };
                init();
                return {
                    map: map,
                    data: data,
                    loadTrack: loadTrack
                };
            }]);
//                map.paths = {
//                    p1: {
//                        color: '#008000',
//                        weight: 8,
//                        latlngs: [
//                            { lat: data.prop.points[0].coordinates[1], lng: data.prop.points[0].coordinates[0] },
//                            { lat: data.prop.points[1].coordinates[1], lng: data.prop.points[1].coordinates[0] },
//                            { lat: data.prop.points[2].coordinates[1], lng: data.prop.points[2].coordinates[0] },
//                            { lat: data.prop.points[3].coordinates[1], lng: data.prop.points[2].coordinates[0] },
//                            { lat: data.prop.points[4].coordinates[1], lng: data.prop.points[2].coordinates[0] }
//                        ],
//                    }
//                };
//                map.markers = {
//                    london: {
//                        lat: data.prop.points[0].coordinates[1],
//                        lng: data.prop.points[0].coordinates[0],
//                        message: "Start",
//                        focus: true
//                    },
//                    paris: {
//                        lat: data.prop.points[4].coordinates[1],
//                        lng: data.prop.points[2].coordinates[0],
//                        message: "Ende",
//                        focus: true
//                    }
//                };

            