angular.module('n52.client.mobile', [])
    .directive('swcCombiMobile', [
        function() {
            return {
                restrict: 'E',
                templateUrl: 'templates/mobile/combi-mobile.html',
                replace: true,
                controller: ['$scope', 'combinedSrvc', 'leafletData',
                    function($scope, combinedSrvc, leafletData) {
                        var mouseValueLabel, mouseTimeLabel, pointG, mouseRect;
                        $scope.events = {
                            geometry: {
                                enable: ['mouseover']
                            }
                        };
                        $scope.geometry = combinedSrvc.geometry;
                        $scope.series = combinedSrvc.series;
                        $scope.highlight = combinedSrvc.highlight;
                        $scope.selectedSection = combinedSrvc.selectedSection;
                        $scope.paths = {
                            section: {
                                color: 'blue',
                                weight: 4,
                                latlngs: []
                            }
                        };

                        $scope.$watch('geometry', function(geometry) {
                            if (geometry && geometry.data && geometry.data.coordinates.length > 0) {
                                centerMap();
                                resetHighlighter();
                            }
                        }, true);

                        $scope.$watch('highlight', function(hl) {
                            if (hl.latlng) {
                                drawMapMarker(hl);
                            } else {
                                hideMapMarker();
                            }
                        }, true);

                        $scope.$on('leafletDirectiveMap.mobileCombiMap.zoomend', function(temp) {
                            if ($scope.highlight.latlng !== undefined) {
                                drawMapMarker($scope.highlight);
                            }
                        });

                        $scope.$watchCollection('selectedSection', function(selection) {
                            if (selection && selection.values && selection.values.length > 0) {
                                $scope.paths.section.latlngs = [];
                                var ll = [];
                                angular.forEach(selection.values, function(value) {
                                    $scope.paths.section.latlngs.push({
                                        lat: value.latlng.lat,
                                        lng: value.latlng.lng
                                    });
                                    ll.push(value.latlng);
                                });
                                leafletData.getMap('mobileCombiMap').then(function(map) {
                                    map.fitBounds(ll);
                                });
                            } else {
                                centerMap();
                                $scope.paths.section.latlngs = [];
                            }
                        }, true);

                        $scope.$on('leafletDirectiveGeoJson.mobileCombiMap.mouseover', function(event, path) {
                            if (path && path.leafletEvent && path.leafletEvent.latlng) {
                                combinedSrvc.showHighlightedItem(path.leafletEvent.latlng);
                            }
                        });

                        var centerMap = function() {
                            if ($scope.geometry && $scope.geometry.data.coordinates.length > 0) {
                                leafletData.getMap('mobileCombiMap').then(function(map) {
                                    var latlngs = [];
                                    angular.forEach($scope.geometry.data.coordinates, function(coords) {
                                        latlngs.push(L.GeoJSON.coordsToLatLng(coords));
                                    });
                                    map.fitBounds(latlngs);
                                });
                            }
                        };

                        function resetHighlighter() {
                            if (pointG) {
                                pointG.remove();
                                mouseRect.remove();
                                mouseValueLabel.remove();
                                mouseTimeLabel.remove();
                                pointG = undefined;
                            }
                        }

                        function drawMapMarker(highlighted) {
                            leafletData.getMap('mobileCombiMap').then(function(map) {
                                var layerpoint = map.latLngToLayerPoint(highlighted.latlng);

                                if (!pointG) {
                                    var g = d3.select(".leaflet-overlay-pane svg")
                                        .append("g");

                                    pointG = g.append("g");
                                    pointG.append("svg:circle")
                                        .attr("r", 6)
                                        .attr("cx", 0)
                                        .attr("cy", 0)
                                        .attr("class", "height-focus circle-lower");

                                    mouseRect = g.append('svg:rect')
                                        .attr('class', 'map-highlight-label');
                                    mouseValueLabel = g.append("svg:text")
                                        .attr("class", "focus-label")
                                        .style("pointer-events", "none");
                                    mouseTimeLabel = g.append("svg:text")
                                        .attr("class", "focus-label")
                                        .style("pointer-events", "none");

                                }
                                pointG.attr("transform", "translate(" + layerpoint.x + "," + layerpoint.y + ")")
                                    .style("visibility", "visible");
                                mouseValueLabel.attr("x", layerpoint.x + 10)
                                    .attr("y", layerpoint.y)
                                    .text(highlighted.value + $scope.series.uom)
                                    .style("visibility", "visible");
                                mouseTimeLabel.attr("x", layerpoint.x + 10)
                                    .attr("y", layerpoint.y + 13)
                                    .text(moment(highlighted.timestamp).format('DD.MM.YY HH:mm'))
                                    .style("visibility", "visible");
                                mouseRect.attr('x', layerpoint.x + 8)
                                    .attr('y', layerpoint.y - 11)
                                    .attr('width', 100)
                                    .attr('height', 28);
                            });
                        }

                        function hideMapMarker() {
                            if (mouseRect) {
                                mouseTimeLabel.style("visibility", "hidden");
                                mouseValueLabel.style("visibility", "hidden");
                                mouseRect.style("visibility", "hidden");
                            }
                            if (pointG) {
                                pointG.style("visibility", "hidden");
                            }
                        }

                    }
                ]
            };
        }
    ])
    .directive('d3LinearChart', ['$window', 'combinedSrvc',
        function($window, combinedSrvc) {
            return {
                restrict: 'EA',
                link: function(scope, elem, attrs) {
                    scope.data = combinedSrvc.data;
                    scope.series = combinedSrvc.series;
                    scope.highlight = combinedSrvc.highlight;

                    var margin = {
                        top: 10,
                        right: 20,
                        bottom: 40,
                        left: 40
                    };
                    var background,
                        pathClass = "path",
                        xScale, yScale, xAxisGen, yAxisGen, lineFun, area,
                        focusG, highlightFocus, focuslabelValue, focuslabelTime, focuslabelY,
                        dragging, dragStart, dragCurrent, dragRect, dragRectG;

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

                    scope.$watchCollection('data', function() {
                        if (scope.data.values.length > 0) {
                            drawLineChart();
                        }
                    });

                    scope.$watchCollection('highlight', function() {
                        if (scope.highlight.xDiagCoord) {
                            showDiagramIndicator(scope.highlight, scope.highlight.xDiagCoord);
                        }
                    });

                    angular.element($window).bind('resize', function() {
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

                        var range = scope.data.range.max - scope.data.range.min;
                        var rangeOffset = range * 0.05;
                        yScale = d3.scale.linear()
                            .domain([scope.data.range.min - rangeOffset, scope.data.range.max + rangeOffset])
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
                            .x(function(d) {
                                var xDiagCoord = xScale(d.dist);
                                d.xDiagCoord = xDiagCoord;
                                return xDiagCoord;
                            })
                            .y(function(d) {
                                return yScale(d.value);
                            })
                            .interpolate("linear");
                        area = d3.svg.area()
                            .x(function(d) {
                                var xDiagCoord = xScale(d.dist);
                                d.xDiagCoord = xDiagCoord;
                                return xDiagCoord;
                            })
                            .y0(height())
                            .y1(function(d) {
                                return yScale(d.value);
                            })
                            .interpolate("linear");
                    }

                    function make_x_axis() {
                        return d3.svg.axis()
                            .scale(xScale)
                            .orient("bottom")
                            .ticks(10);
                    }

                    function make_y_axis() {
                        return d3.svg.axis()
                            .scale(yScale)
                            .orient("left")
                            .ticks(5);
                    }

                    function drawLineChart() {
                        graph.selectAll("*").remove();

                        setChartParameters();

                        // draw the x grid lines
                        graph.append("svg:g")
                            .attr("class", "grid")
                            .attr("transform", "translate(0," + height() + ")")
                            .call(make_x_axis().tickSize(-height(), 0, 0).tickFormat(''));

                        graph.append("text") // text label for the x axis
                            .attr("x", width() / 2)
                            .attr("y", height() + margin.bottom - 5)
                            .style("text-anchor", "middle")
                            .text("Distance");

                        // draw the y grid lines
                        graph.append("svg:g")
                            .attr("class", "grid")
                            .call(make_y_axis().tickSize(-width(), 0, 0).tickFormat(''));

                        graph.append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 0 - margin.left)
                            .attr("x", 0 - (height() / 2))
                            .attr("dy", "1em")
                            .style("text-anchor", "middle")
                            .text(scope.series.uom);

                        // draw filled area
                        graph.append("svg:path")
                            .datum(scope.data.values)
                            .attr({
                                d: area,
                                "class": "graphArea"
                            });

                        // draw x axis
                        graph.append("svg:g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height() + ")")
                            .call(xAxisGen);

                        // draw right axis as border
                        graph.append("svg:g")
                            .attr("class", "x axis")
                            .call(d3.svg.axis()
                                .scale(xScale)
                                .orient("top")
                                .tickSize(0)
                                .tickFormat(''));

                        // draw y axis
                        graph.append("svg:g")
                            .attr("class", "y axis")
                            .call(yAxisGen);

                        // draw right axis as border
                        graph.append("svg:g")
                            .attr("class", "y axis")
                            .attr("transform", "translate(" + width() + ", 0)")
                            .call(d3.svg.axis()
                                .scale(yScale)
                                .orient("right")
                                .tickSize(0)
                                .tickFormat(''));

                        // draw the value line
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
                            .on("mouseout.focus", mouseoutHandler)
                            .on("mousedown.drag", dragStartHandler)
                            .on("mousemove.drag", dragHandler)
                            .on("mouseup.drag", dragEndHandler);

                        focusG = graph.append("g");
                        highlightFocus = focusG.append('svg:line')
                            .attr('class', 'mouse-focus-line')
                            .attr('x2', '0')
                            .attr('y2', '0')
                            .attr('x1', '0')
                            .attr('y1', '0');
                        focuslabelValue = focusG.append("svg:text")
                            .style("pointer-events", "none")
                            .attr("class", "mouse-focus-label-x");
                        focuslabelTime = focusG.append("svg:text")
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
                        combinedSrvc.highlightByIdx(getItemForX(coords[0]));
                        scope.$apply();
                    }

                    function mouseoutHandler() {
                        hideDiagramIndicator();
                    }

                    function dragStartHandler() {
                        d3.event.preventDefault();
                        d3.event.stopPropagation();
                        dragging = false;
                        dragStart = d3.mouse(background.node());
                    }

                    function dragHandler() {
                        d3.event.preventDefault();
                        d3.event.stopPropagation();
                        dragging = true;
                        drawDragRectangle();
                    }

                    function dragEndHandler() {
                        if (!dragStart || !dragging) {
                            dragStart = null;
                            dragging = false;
                            resetDrag();
                        } else {
                            combinedSrvc.setSelection(getItemForX(dragStart[0]), getItemForX(dragCurrent[0]));
                            dragStart = null;
                            dragging = false;
                        }
                        scope.$apply();
                    }

                    function drawDragRectangle() {
                        if (!dragStart) {
                            return;
                        }

                        dragCurrent = d3.mouse(background.node());

                        var x1 = Math.min(dragStart[0], dragCurrent[0]),
                            x2 = Math.max(dragStart[0], dragCurrent[0]);

                        if (!dragRect && !dragRectG) {

                            dragRectG = graph.append("g");

                            dragRect = dragRectG.append("rect")
                                .attr("width", x2 - x1)
                                .attr("height", height())
                                .attr("x", x1)
                                .attr('class', 'mouse-drag')
                                .style("pointer-events", "none");
                        } else {
                            dragRect.attr("width", x2 - x1)
                                .attr("x", x1);
                        }
                    }

                    function resetDrag() {
                        combinedSrvc.resetSelection();
                        if (dragRectG !== null) {
                            dragRectG.remove();
                            dragRectG = null;
                            dragRect = null;
                        }
                    }

                    function getItemForX(x) {
                        var bisect = d3.bisector(function(d) {
                            return d.dist;
                        }).left;
                        var xinvert = xScale.invert(x);
                        return bisect(scope.data.values, xinvert);
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

                        var alt = item.value,
                            dist = item.dist,
                            numY = alt,
                            numX = dist;

                        focuslabelValue
                            .attr("x", xCoordinate + 2)
                            .attr("y", 13)
                            .text(numY + scope.series.uom);
                        focuslabelTime
                            .attr('x', xCoordinate - 95)
                            .attr('y', 13)
                            .text(moment(item.timestamp).format('DD.MM.YY HH:mm'));
                        focuslabelY
                            .attr("y", height() - 5)
                            .attr("x", xCoordinate + 2)
                            .text(numX + " km");
                    }
                }
            };
        }
    ])
    .service('combinedSrvc', ['interfaceService', 'statusService',
        function(interfaceService, statusService) {
            this.highlight = {};
            this.selectedSection = {
                values: []
            };
            this.geometry = {
                style: {
                    weight: 2,
                    opacity: 1,
                    color: 'red',
                    dashArray: '10, 5',
                    clickable: true
                },
                data: {
                    coordinates: [],
                    type: 'LineString'
                }
            };
            this.data = {
                values: [],
                range: {
                    max: 0,
                    min: Infinity
                },
                dist: 0
            };
            this.series = {};

            this.loadSeries = function(id, url) {
                statusService.status.mobile = {
                    id: id,
                    url: url
                };
                this.series.loading = true;
                interfaceService.getDatasets(id, url)
                    .then(s => {
                        angular.extend(this.series, s);
                        var timespan = {
                            start: s.firstValue.timestamp,
                            end: s.lastValue.timestamp
                        };
                        interfaceService.getDatasetData(s.id, url, timespan, {
                                expanded: true
                            })
                            .then(data => {
                                this.processData(data[id].values);
                                this.series.loading = false;
                            });
                    });
            };

            this.processData = function(data) {
                this.resetGeometry();
                this.resetData();
                for (var i = 0; i < data.length; i++) {
                    this.addToGeometry(data[i]);
                    this.addToData(data[i], data[i ? i - 1 : 0]);
                }
            };

            this.addToGeometry = function(entry) {
                this.geometry.data.coordinates.push(entry.geometry.coordinates);
            };

            this.addToData = function(entry, previous) {
                var s = new L.LatLng(entry.geometry.coordinates[1], entry.geometry.coordinates[0]);
                var e = new L.LatLng(previous.geometry.coordinates[1], previous.geometry.coordinates[0]);
                var newdist = s.distanceTo(e);
                this.data.dist = this.data.dist + Math.round(newdist / 1000 * 100000) / 100000;
                this.data.range.max = this.data.range.max < entry.value ? entry.value : this.data.range.max;
                this.data.range.min = this.data.range.min > entry.value ? entry.value : this.data.range.min;
                this.data.values.push({
                    dist: Math.round(this.data.dist * 10) / 10,
                    timestamp: entry.timestamp,
                    value: entry.value,
                    x: entry.geometry.coordinates[0],
                    y: entry.geometry.coordinates[1],
                    latlng: s
                });
            };

            this.resetGeometry = function() {
                this.geometry.data.coordinates = [];
            };

            this.resetData = function() {
                this.data.values = [];
                this.data.dist = 0;
                this.data.range.max = 0;
                this.data.range.min = Infinity;
            };

            this.findItemForLatLng = function(latlng) {
                var result = null,
                    d = Infinity;
                angular.forEach(this.data.values, function(item) {
                    var dist = latlng.distanceTo(item.latlng);
                    if (dist < d) {
                        d = dist;
                        result = item;
                    }
                });
                return result;
            };

            this.highlightByIdx = function(idx) {
                angular.extend(this.highlight, this.data.values[idx]);
            };

            this.showHighlightedItem = function(latlng) {
                angular.extend(this.highlight, this.findItemForLatLng(latlng));
            };

            this.setSelection = function(startIdx, endIdx) {
                var start = Math.min(startIdx, endIdx),
                    end = Math.max(startIdx, endIdx);
                this.selectedSection.values = this.data.values.slice(start, end);
            };

            this.resetSelection = function() {
                this.selectedSection.values = [];
            };

            if (statusService.status.mobile) {
                let lastEntry = statusService.status.mobile;
                if (lastEntry.id && lastEntry.url) {
                    this.loadSeries(lastEntry.id, lastEntry.url);
                }
            }
        }
    ])
    .service('mobilePresentDataset', ['$location', 'combinedSrvc',
        function($location, combinedSrvc) {
            this.presentDataset = function(dataset, providerUrl) {
                combinedSrvc.loadSeries(dataset.id, providerUrl);
                $location.url('/mobileDiagram');
            };
        }
    ]);
