angular.module('n52.core.profile')
    .controller('SwcProfileCtrl', ['$scope', 'profilesService',
        function($scope, profilesService) {
            $scope.datasets = profilesService.profiles;
            $scope.data = profilesService.profileData;
        }
    ])
    .component('profileChart', {
        bindings: {
            datasets: '<',
            data: '<',
            onChartHighlight: '&'
        },
        template: require('./chart.component.html'),
        controller: [
            function() {
                var previousData;
                var previousDatasets;

                this.$onInit = function() {};

                this.$doCheck = function() {
                    var change = false;
                    if (!angular.equals(previousData, this.data)) {
                        previousData = angular.copy(this.data);
                        change = true;
                    }
                    if (!angular.equals(previousDatasets, this.datasets)) {
                        previousDatasets = angular.copy(this.datasets);
                        change = true;
                    }
                    if (change) prepareData(this.data);
                };

                this.onHighlight = (highlight) => {
                    this.onChartHighlight({
                        highlight
                    });
                };

                var prepareData = () => {
                    this.chartData = {};
                    for (var id in this.data) {
                        if (this.data.hasOwnProperty(id) && this.data[id].length > 0 && !this.datasets[id].style.hidden) {
                            var data = this.data[id][0];
                            var datasets = this.datasets[id];
                            this.chartData[id] = data;
                            this.chartData[id].color = datasets.style.color;
                            this.chartData[id].selected = datasets.style.selected;
                            this.chartData[id].label = datasets.label;
                            this.chartData[id].horizontalUnit = datasets.uom;
                        }
                    }
                };
            }
        ]
    })
    .directive('profileChartPlotly', ['$window',
        function($window) {
            var uniqueId = 1;
            return {
                restrict: 'EA',
                scope: {
                    data: '=',
                    onHighlight: '&'
                },
                template: '<div id="{{::uniqueId}}" style="width: 100%; height:100%;"></div>',
                link: function(scope) {

                    scope.uniqueId = 'item' + uniqueId++;

                    var data = [];

                    var layout = {
                        autosize: true,
                        showlegend: false,
                        dragmode: 'pan',
                        margin: {
                            l: 40,
                            r: 10,
                            b: 40,
                            t: 10
                            // pad: 100
                        },
                        hovermode: 'closest',
                        counterYAxis: 0,
                        counterXAxis: 0
                    };

                    var settings = {
                        displayModeBar: false,
                        modeBarButtonsToRemove: [
                            'sendDataToCloud',
                            'hoverCompareCartesian'
                        ],
                        displaylogo: false,
                        showTips: false,
                        scrollZoom: true
                    };

                    angular.element($window).on('resize', () => {
                        redrawChart();
                    });

                    scope.$on('$destroy', () => {
                        angular.element($window).off('resize');
                    });

                    scope.$watch('data', () => {
                        drawChart();
                    }, true);

                    var processData = () => {
                        clearLayout();
                        clearData();
                        for (var id in scope.data) {
                            if (scope.data.hasOwnProperty(id)) {
                                var dataEntry = scope.data[id];
                                var trace = {
                                    x: [],
                                    y: [],
                                    mode: 'markers',
                                    name: '',
                                    yaxis: createYAxis(dataEntry),
                                    xaxis: createXAxis(dataEntry),
                                    // hovertext: dataEntry.label,
                                    // markers: {
                                    //     color: dataEntry.color,
                                    //     width: dataEntry.selected ? 5 : 2
                                    // },
                                    marker: {
                                        color: dataEntry.color,
                                        size: dataEntry.selected ? 10 : 6
                                    }
                                };
                                dataEntry.value.forEach((entry) => {
                                    trace.x.push(entry.value);
                                    trace.y.push(entry.vertical);
                                });
                                data.push(trace);
                            }
                        }
                        updateAxis();
                    };

                    var clearData = () => {
                        data = [];
                    };

                    var clearLayout = () => {
                        // todo remove yaxis
                        for (var key in layout) {
                            if (layout.hasOwnProperty(key) && (key.startsWith('yaxis') || key.startsWith('xaxis'))) {
                                delete layout[key];
                            }
                        }
                        // reset counter
                        layout.counterYAxis = 0;
                        layout.counterXAxis = 0;
                    };

                    var createYAxis = (dataEntry) => {
                        var axis;
                        // find axis
                        for (var key in layout) {
                            if (layout.hasOwnProperty(key) &&
                                key.startsWith('yaxis') &&
                                layout[key].title === dataEntry.verticalUnit) {
                                axis = layout[key];
                            }
                        }
                        if (!axis) {
                            // add axis
                            layout.counterYAxis = layout.counterYAxis + 1;
                            axis = layout[('yaxis' + layout.counterYAxis)] = {
                                id: 'y' + layout.counterYAxis,
                                // zeroline: true,
                                anchor: 'free',
                                hoverformat: '.2r',
                                side: 'left',
                                autorange: 'reversed',
                                showline: false,
                                title: dataEntry.verticalUnit,
                                fixedrange: false
                            };
                            if (layout.counterYAxis !== 1) {
                                axis.overlaying = 'y';
                            }
                        }
                        return axis.id;
                    };

                    var createXAxis = (dataEntry) => {
                        var axis;
                        for (var key in layout) {
                            if (layout.hasOwnProperty(key) && key.startsWith('xaxis') && layout[key].title === dataEntry.horizontalUnit) {
                                axis = layout[key];
                            }
                        }
                        var range = $window.d3.extent(dataEntry.value, (d) => d.value);
                        if (!axis) {
                            layout.counterXAxis = layout.counterXAxis + 1;
                            axis = layout['xaxis' + layout.counterXAxis] = {
                                id: 'x' + layout.counterXAxis,
                                anchor: 'free',
                                title: dataEntry.horizontalUnit,
                                zeroline: true,
                                hoverformat: '.2f',
                                showline: false,
                                range: [range[0], range[1]],
                                // rangemode: 'tozero',
                                fixedrange: false
                            };
                            if (layout.counterXAxis !== 1) {
                                axis.overlaying = 'x';
                            }
                        } else {
                            axis.range = $window.d3.extent([range[0], range[1], axis.range[0], axis.range[1]]);
                        }
                        return axis.id;
                    };

                    var updateAxis = () => {
                        if (layout.counterYAxis > 1) {
                            for (var key in layout) {
                                if (layout.hasOwnProperty(key) && key.startsWith('xaxis')) {
                                    layout[key].domain = [(0.1 * layout.counterYAxis) - 0.1, 1];
                                }
                            }
                            var yaxisCount = 0;
                            for (key in layout) {
                                if (layout.hasOwnProperty(key) && key.startsWith('yaxis')) {
                                    layout[key].position = 0.1 * yaxisCount;
                                    yaxisCount += 1;
                                }
                            }
                        }
                        if (layout.counterXAxis > 1) {
                            for (key in layout) {
                                if (layout.hasOwnProperty(key) && key.startsWith('yaxis')) {
                                    layout[key].domain = [(0.06 * layout.counterXAxis) - 0.06, 1];
                                }
                            }
                            var xaxisCount = 0;
                            for (key in layout) {
                                if (layout.hasOwnProperty(key) && key.startsWith('xaxis')) {
                                    layout[key].position = 0.06 * xaxisCount;
                                    xaxisCount += 1;
                                }
                            }
                        }
                        // add offset to xaxis ranges
                        for (key in layout) {
                            if (layout.hasOwnProperty(key) && key.startsWith('xaxis')) {
                                var range = layout[key].range;
                                var rangeOffset = (range[1] - range[0]) * 0.05;
                                layout[key].range = [range[0] - rangeOffset, range[1] + rangeOffset];
                            }
                        }
                    };

                    var drawChart = () => {
                        processData();
                        $window.Plotly.newPlot(scope.uniqueId, data, layout, settings);
                        document.getElementById(scope.uniqueId).on('plotly_hover', (entry) => {
                            if (entry.points.length === 1) {
                                scope.onHighlight({
                                    highlight: {
                                        index: entry.points[0].pointNumber
                                    }
                                });
                            }
                        });
                    };

                    var redrawChart = () => {
                        $window.Plotly.relayout(scope.uniqueId, {});
                    };

                }
            };
        }
    ]);
