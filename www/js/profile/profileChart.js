angular.module('n52.core.profile')
    .component('profileChart', {
        bindings: {
            datasets: '<',
            data: '<',
            options: '<'
        },
        templateUrl: 'n52.core.profile.profile-chart',
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
                    if (change) prepareData();
                };

                var prepareData = () => {
                    this.chartData = {};
                    for (var id in this.data) {
                        if (this.data.hasOwnProperty(id) && !this.datasets[id].style.hidden) {
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
                            r: 50,
                            b: 40,
                            t: 40
                            // pad: 100
                        },
                        hovermode: 'y',
                        counterYaxis: 0,
                        xaxis: {
                            zeroline: false,
                            hoverformat: '.2f',
                            showline: true,
                            fixedrange: false
                        }
                    };

                    var settings = {
                        displayModeBar: false,
                        modeBarButtonsToRemove: [
                            'sendDataToCloud',
                            'hoverCompareCartesian'
                        ],
                        displaylogo: false,
                        showTips: false
                    };

                    angular.element($window).bind('resize', () => {
                        redrawChart();
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
                                    type: 'scatter',
                                    name: dataEntry.label,
                                    // yaxis: 'y1',
                                    yaxis: createYAxis(dataEntry),
                                    line: {
                                        color: dataEntry.color,
                                        width: dataEntry.selected ? 5 : 2
                                    },
                                    marker: {
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
                            if (layout.hasOwnProperty(key) && key.startsWith('yaxis')) {
                                delete layout[key];
                            }
                        }
                        // reset counter
                        layout.counterYaxis = 0;
                    };

                    var createYAxis = (dataEntry) => {
                        var axis;
                        // find axis
                        for (var key in layout) {
                            if (layout.hasOwnProperty(key) && key.startsWith('yaxis')) {
                                if (layout[key].title === dataEntry.verticalUnit) {
                                    axis = layout[key];
                                }
                            }
                        }
                        if (!axis) {
                            // add axis
                            layout.counterYaxis = layout.counterYaxis + 1;
                            axis = layout[('yaxis' + layout.counterYaxis)] = {
                                id: 'y' + layout.counterYaxis,
                                // zeroline: true,
                                anchor: 'free',
                                hoverformat: '.2r',
                                side: 'left',
                                title: dataEntry.verticalUnit,
                                fixedrange: true
                            };
                            if (layout.counterYaxis !== 1) {
                                axis.overlaying = 'y';
                            }
                        }
                        return axis.id;
                    };

                    var updateAxis = () => {
                        if (layout.counterYaxis > 1) {
                            for (var key in layout) {
                                if (layout.hasOwnProperty(key) && key.startsWith('xaxis')) {
                                    layout[key].domain = [0.1, 1];
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
                    };

                    var drawChart = () => {
                        processData();
                        $window.Plotly.newPlot(scope.uniqueId, data, layout, settings);
                    };

                    var redrawChart = () => {
                        $window.Plotly.relayout(scope.uniqueId, {});
                    };
                }
            };
        }
    ]);
