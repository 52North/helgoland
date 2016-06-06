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
                  $scope.highlight = combinedSrvc.highlight;
                  $scope.selectedSection = combinedSrvc.selectedSection;
                  $scope.paths = {
                    section: {
                      color: 'blue',
                      weight: 4,
                      latlngs: []
                    }
                  };

                  $scope.$watch('geojson', function (geojson) {
                    if (geojson && geojson.data && geojson.data.features[0].geometry.coordinates) {
                      centerMap();
                    }
                  }, true);

                  $scope.$watch('highlight', function (hl) {
                    if (hl.latlng) {
                      drawMapMarker(hl.latlng, hl.value);
                    } else {
                      hideMapMarker();
                    }
                  }, true);

                  $scope.$watchCollection('selectedSection', function (selection) {
                    if (selection && selection.values && selection.values.length > 0) {
                      $scope.paths.section.latlngs = [];
                      var ll = [];
                      angular.forEach(selection.values, function (value) {
                        $scope.paths.section.latlngs.push({
                          lat: value.latlng.lat,
                          lng: value.latlng.lng
                        });
                        ll.push(value.latlng);
                      });
                      leafletData.getMap('mobileCombiMap').then(function (map) {
                        map.fitBounds(ll);
                      });
                    } else {
                      centerMap();
                      $scope.paths.section.latlngs = [];
                    }
                  }, true);

                  $scope.$on('leafletDirectiveGeoJson.mobileCombiMap.mouseover', function (event, path) {
                    if (path && path.leafletEvent && path.leafletEvent.latlng) {
                      combinedSrvc.showHighlightedItem(path.leafletEvent.latlng);
                    }
                  });

                  var centerMap = function () {
                    if ($scope.geojson && $scope.geojson.data) {
                      leafletData.getMap('mobileCombiMap').then(function (map) {
                        var latlngs = [];
                        angular.forEach($scope.geojson.data.features[0].geometry.coordinates, function (coords) {
                          latlngs.push(L.GeoJSON.coordsToLatLng(coords));
                        });
                        map.fitBounds(latlngs);
                      });
                    }
                  };

                  function drawMapMarker(point, value) {
                    leafletData.getMap('mobileCombiMap').then(function (map) {
                      var layerpoint = map.latLngToLayerPoint(point);

                      if (!pointG) {
                        var g = d3.select(".leaflet-overlay-pane svg")
                                .append("g");

                        pointG = g.append("g");
                        pointG.append("svg:circle")
                                .attr("r", 6)
                                .attr("cx", 0)
                                .attr("cy", 0)
                                .attr("class", "height-focus circle-lower");

                        mouseHeightFocusLabel = g.append("svg:text")
                                .attr("class", "height-focus-label")
                                .style("pointer-events", "none");
                      }
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
                scope.highlight = combinedSrvc.highlight;

                var margin = {
                  top: 10,
                  right: 20,
                  bottom: 30,
                  left: 50
                };
                var background,
                        pathClass = "path",
                        xScale, yScale, xAxisGen, yAxisGen, lineFun,
                        focusG, highlightFocus, focuslabelX, focuslabelY,
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

                scope.$watchCollection('data', function () {
                  if (scope.data.values.length > 0) {
                    drawLineChart();
                  }
                });

                scope.$watchCollection('highlight', function () {
                  if (scope.highlight.xDiagCoord) {
                    showDiagramIndicator(scope.highlight, scope.highlight.xDiagCoord);
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
                            return yScale(d.value);
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
                    combinedSrvc.setSelection(getItemForX(dragStart[0]), getItemForX(dragEndCoords[0]));
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
                  var bisect = d3.bisector(function (d) {
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
        .factory('combinedSrvc', ['interfaceV2Service',
          function (interfaceV2Service) {
            var highlight = {};
            var selectedSection = {
              values: []
            };
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

            var timespan = {start: 1360114237000, end: 1360211238000};
            interfaceV2Service.getSeriesData('measurement/113976', 'http://192.168.52.117:8080/series-dao-webapp/api/v1/', timespan)
                    .then(function (data) {
                      geojson.data = createLineString(data);
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
                    value: coords[i][2],
                    x: coords[i][0],
                    y: coords[i][1],
                    latlng: s
                  });
                }
              }
            };

            var createLineString = function (data) {
              var lineString = {
                type: 'FeatureCollection',
                features: [
                  {
                    geometry: {
                      coordinates: [],
                      type: 'LineString'
                    },
                    type: 'Feature'
                  }
                ]
              };
              for (var i = 0; i < data.values.length; i++) {
                var temp = data.values[i].geometry.coordinates;
                temp.push(data.values[i].value);
                lineString.features[0].geometry.coordinates.push(temp);
              }
              return lineString;
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

            var highlightByIdx = function (idx) {
              angular.extend(highlight, data.values[idx]);
            };

            var showHighlightedItem = function (latlng) {
              angular.extend(highlight, findItemForLatLng(latlng));
            };

            var setSelection = function (startIdx, endIdx) {
              var start = Math.min(startIdx, endIdx),
                      end = Math.max(startIdx, endIdx);
              selectedSection.values = data.values.slice(start, end);
            };

            var resetSelection = function () {
              selectedSection.values = [];
            };

            return {
              showHighlightedItem: showHighlightedItem,
              highlightByIdx: highlightByIdx,
              setSelection: setSelection,
              resetSelection: resetSelection,
              selectedSection: selectedSection,
              highlight: highlight,
              geojson: geojson,
              data: data
            };
          }]);