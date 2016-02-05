angular.module('n52.core.combiMobile', [])
        .directive('swcCombiMobile', [
            function () {
                return {
                    restrict: 'E',
                    templateUrl: 'templates/combiMobile/combi-mobile.html',
                    replace: true,
                    controller: ['$scope', 'combinedSrvc', 'leafletData',
                        function ($scope, combinedSrvc, leafletData) {
                            var mouseHeightFocus, mouseHeightFocusLabel, pointG;

                            $scope.events = {
                                geojson: {
                                    enable: ['mouseover']
                                }
                            };
                            $scope.geojson = combinedSrvc.geojson;
                            $scope.selection = combinedSrvc.selection;

                            $scope.$watch('selection', function (selection) {
                                console.info(selection.latlng);
                                if (selection.latlng) {
                                    drawMapMarker(selection.latlng, selection.altitude);
                                } else {
                                    hideMapMarker();
                                }
                            }, true);

                            $scope.$on('leafletDirectiveGeoJson.mobileCombiMap.mouseover', function (event, path) {
                                if (path && path.leafletEvent && path.leafletEvent.latlng) {
                                    combinedSrvc.showSelectedItem(path.leafletEvent.latlng);
                                }
                            });

                            function drawMapMarker(point, value) {
                                leafletData.getMap('mobileCombiMap').then(function (map) {
                                    var layerpoint = map.latLngToLayerPoint(point);

                                    var opts = {
                                        "theme": "test"
                                    };

                                    if (!mouseHeightFocus) {
                                        var heightG = d3.select(".leaflet-overlay-pane svg")
                                                .append("g");
                                        mouseHeightFocus = heightG.append('svg:line')
                                                .attr("class", " height-focus line")
                                                .attr("x2", 0)
                                                .attr("y2", 0)
                                                .attr("x1", 0)
                                                .attr("y1", 0);

                                        pointG = heightG.append("g");
                                        pointG.append("svg:circle")
                                                .attr("r", 6)
                                                .attr("cx", 0)
                                                .attr("cy", 0)
                                                .attr("class", opts.theme + " height-focus circle-lower");

                                        mouseHeightFocusLabel = heightG.append("svg:text")
                                                .attr("class", opts.theme + " height-focus-label")
                                                .style("pointer-events", "none");
                                    }

//                                    var normalizedAlt = 200 / scope.data.elevation.max * value;
//                                    var normalizedY = layerpoint.y - normalizedAlt;
                                    mouseHeightFocus.attr("x1", layerpoint.x)
                                            .attr("x2", layerpoint.x)
                                            .attr("y1", layerpoint.y)
//                                            .attr("y2", normalizedY)
                                            .style("visibility", "visible");

                                    pointG.attr("transform", "translate(" + layerpoint.x + "," + layerpoint.y + ")")
                                            .style("visibility", "visible");

                                    mouseHeightFocusLabel.attr("x", layerpoint.x + 7)
                                            .attr("y", layerpoint.y)
                                            .text(value + " m")
                                            .style("visibility", "visible");
                                });
                            }

                            function hideMapMarker() {
                                if (mouseHeightFocus) {
                                    mouseHeightFocus.style("visibility", "hidden");
                                    mouseHeightFocusLabel.style("visibility", "hidden");
                                }
                                if (pointG) {
                                    pointG.style("visibility", "hidden");
                                }
                            }

                        }]
                };
            }])
        .directive('d3LinearChart', ['$window', 'combinedSrvc',
            function ($window, combinedSrvc) {
                return {
                    restrict: 'EA',
                    link: function (scope, elem, attrs) {
                        scope.data = combinedSrvc.data;
                        scope.selection = combinedSrvc.selection;

                        var margin = {
                            top: 10,
                            right: 20,
                            bottom: 30,
                            left: 50
                        };
                        var background,
                                pathClass = "path",
                                xScale, yScale, xAxisGen, yAxisGen, lineFun,
                                focusG, highlightFocus, focuslabelX, focuslabelY;

                        var d3 = $window.d3;

                        d3.select(elem[0])
                                .append('svg')
                                .attr('width', '100%')
                                .attr('height', '100%');

                        var rawSvg = elem.find('svg');

                        var svgElem = d3.select(rawSvg[0]);

                        var graph = svgElem
                                .append("g")
                                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                        scope.$watchCollection('data', function () {
                            if (scope.data.values.length > 0) {
                                drawLineChart();
                            }
                        });

                        scope.$watchCollection('selection', function (newVal, oldVal) {
                            console.info(scope.selection.altitude);
                            if (scope.selection.xDiagCoord) {
                                showDiagramIndicator(scope.selection, scope.selection.xDiagCoord);
                            }
                        });

                        angular.element($window).bind('resize', function () {
                            drawLineChart();
                        });

                        function height() {
                            return rawSvg.height() - margin.top - margin.bottom;
                        }

                        function width() {
                            return rawSvg.width() - margin.left - margin.right;
                        }

                        function setChartParameters() {
                            xScale = d3.scale.linear()
                                    .domain([scope.data.values[0].dist, scope.data.values[scope.data.values.length - 1].dist])
                                    .range([0, width()]);

                            yScale = d3.scale.linear()
                                    .domain([scope.data.elevation.min, scope.data.elevation.max])
                                    .range([height(), 0]);

                            xAxisGen = d3.svg.axis()
                                    .scale(xScale)
                                    .orient("bottom")
                                    .ticks(10);

                            yAxisGen = d3.svg.axis()
                                    .scale(yScale)
                                    .orient("left")
                                    .ticks(5);

                            lineFun = d3.svg.line()
                                    .x(function (d) {
                                        var xDiagCoord = xScale(d.dist);
                                        d.xDiagCoord = xDiagCoord;
                                        return xDiagCoord;
                                    })
                                    .y(function (d) {
                                        return yScale(d.altitude);
                                    })
                                    .interpolate("basis");
                        }

                        function drawLineChart() {
                            graph.selectAll("*").remove();

                            setChartParameters();

                            graph.append("svg:g")
                                    .attr("class", "x axis")
                                    .attr("transform", "translate(0," + height() + ")")
                                    .call(xAxisGen);

                            graph.append("svg:g")
                                    .attr("class", "y axis")
                                    .call(yAxisGen);

                            graph.append("svg:path")
                                    .attr({
                                        d: lineFun(scope.data.values),
                                        "stroke": "blue",
                                        "stroke-width": 2,
                                        "fill": "none",
                                        "class": pathClass
                                    });
                            background = graph.append("svg:rect")
                                    .attr({
                                        "width": width(),
                                        "height": height(),
                                        "fill": "none",
                                        "stroke": "none",
                                        "pointer-events": "all"
                                    })
                                    .on("mousemove.focus", mousemoveHandler)
                                    .on("mouseout.focus", mouseoutHandler);
//                                    .on("mousedown.drag", dragStartHandler)
//                                    .on("mousemove.drag", dragHandler);

                            focusG = graph.append("g");
                            highlightFocus = focusG.append('svg:line')
                                    .attr('class', 'mouse-focus-line')
                                    .attr('x2', '0')
                                    .attr('y2', '0')
                                    .attr('x1', '0')
                                    .attr('y1', '0');
                            focuslabelX = focusG.append("svg:text")
                                    .style("pointer-events", "none")
                                    .attr("class", "mouse-focus-label-x");
                            focuslabelY = focusG.append("svg:text")
                                    .style("pointer-events", "none")
                                    .attr("class", "mouse-focus-label-y");
                        }

                        function mousemoveHandler(d, i, ctx) {
                            if (!scope.data.values || scope.data.values.length === 0) {
                                return;
                            }
                            var coords = d3.mouse(background.node());
                            combinedSrvc.selectByIdx(getItemForX(coords[0]));
                            scope.$apply();
                        }

                        function getItemForX(x) {
                            var bisect = d3.bisector(function (d) {
                                return d.dist;
                            }).left;
                            var xinvert = xScale.invert(x);
                            return bisect(scope.data.values, xinvert);
                        }

                        function mouseoutHandler() {
                            hideDiagramIndicator();
                        }

                        function hideDiagramIndicator() {
                            focusG.style("visibility", "hidden");
                        }

                        function showDiagramIndicator(item, xCoordinate) {
                            focusG.style("visibility", "visible");
                            highlightFocus.attr('x1', xCoordinate)
                                    .attr('y1', 0)
                                    .attr('x2', xCoordinate)
                                    .attr('y2', height())
                                    .classed('hidden', false);

                            var alt = item.altitude,
                                    dist = item.dist,
                                    ll = item.latlng,
                                    numY = alt,
                                    numX = dist;
//                                    numY = opts.hoverNumber.formatter(alt, opts.hoverNumber.decimalsY),
//                                    numX = opts.hoverNumber.formatter(dist, opts.hoverNumber.decimalsX);

                            focuslabelX
                                    .attr("x", xCoordinate + 2)
                                    .attr("y", 10)
                                    .text(numY + " m");
                            focuslabelY
                                    .attr("y", height() - 5)
                                    .attr("x", xCoordinate + 2)
                                    .text(numX + " km");
                        }
                    }
                };
            }])
        .factory('combinedSrvc', ['$http', 'leafletData', '$interval',
            function ($http, leafletData, $interval) {
                var selection = {};
                var geojson = {
                    style: {
                        weight: 2,
                        opacity: 1,
                        color: 'red',
                        dashArray: '10, 5',
                        clickable: true
                    }
                };
                var data = {
                    values: [],
                    elevation: {
                        max: 0,
                        min: Infinity
                    },
                    dist: 0
                };
                $http.get('js/combinedMobile/nuerburgRing.json').then(function (response) {
                    geojson.data = response.data;
                    centerMap();
                    createData(getCoords(geojson.data));
                });

                var getCoords = function (data) {
                    if (data && data.features && angular.isArray(data.features) && data.features.length > 0) {
                        var feature = data.features[0];
                        var geom = feature && feature.geometry;
                        if (geom && geom.type === 'LineString') {
                            return geom.coordinates;
                        }
                    }
                };

                var createData = function (coords) {
                    if (coords) {
                        data.values = [];
                        data.dist = 0;
                        data.elevation.max = 0;
                        data.elevation.min = Infinity;
                        for (var i = 0; i < coords.length; i++) {
                            var s = new L.LatLng(coords[i][1], coords[i][0]);
                            var e = new L.LatLng(coords[i ? i - 1 : 0][1], coords[i ? i - 1 : 0][0]);
                            var newdist = s.distanceTo(e);
                            data.dist = data.dist + Math.round(newdist / 1000 * 100000) / 100000;
                            data.elevation.max = data.elevation.max < coords[i][2] ? coords[i][2] : data.elevation.max;
                            data.elevation.min = data.elevation.min > coords[i][2] ? coords[i][2] : data.elevation.min;
                            data.values.push({
                                dist: data.dist,
                                altitude: coords[i][2],
                                x: coords[i][0],
                                y: coords[i][1],
                                latlng: s
                            });
                        }
                    }
                };

                var centerMap = function () {
                    leafletData.getMap('mobileCombiMap').then(function (map) {
                        var latlngs = [];
                        for (var i in geojson.data.features[0].geometry.coordinates) {
                            var points = geojson.data.features[0].geometry.coordinates[i];
                            latlngs.push(L.GeoJSON.coordsToLatLng(points));
                        }
                        map.fitBounds(latlngs);
                    });
                };

                var findItemForLatLng = function (latlng) {
                    var result = null,
                            d = Infinity;
                    angular.forEach(data.values, function (item) {
                        var dist = latlng.distanceTo(item.latlng);
                        if (dist < d) {
                            d = dist;
                            result = item;
                        }
                    });
                    return result;
                };

                var selectByIdx = function (idx) {
                    angular.extend(selection, data.values[idx]);
                };

                var showSelectedItem = function (latlng) {
                    angular.extend(selection, findItemForLatLng(latlng));
                };

                return {
                    showSelectedItem: showSelectedItem,
                    selectByIdx: selectByIdx,
                    selection: selection,
                    geojson: geojson,
                    data: data
                };
            }]);