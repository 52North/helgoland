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
                            this.chartData[id] = this.data[id][0];
                            this.chartData[id].color = this.datasets[id].style.color;
                            this.chartData[id].selected = this.datasets[id].style.selected;
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

                    angular.element($window).bind('resize', () => {
                        redrawChart();
                    });

                    scope.$watch('data', () => {
                        drawChart();
                    }, true);

                    var processData = () => {
                        var data = [];
                        for (var id in scope.data) {
                            if (scope.data.hasOwnProperty(id)) {
                                debugger;
                                var dataEntry = scope.data[id];
                                var trace = {
                                    x: [],
                                    y: [],
                                    type: 'scatter',
                                    name: 'Horst',
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
                        return data;
                    };

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
                        // title: 'Formatting X & Y Hover Values',
                        xaxis: {
                            zeroline: false,
                            hoverformat: '.2f',
                            showline: true,
                            fixedrange: false
                            // title: 'Rounded: 2 values after the decimal point on hover'
                        },
                        yaxis: {
                            zeroline: true,
                            hoverformat: '.2r',
                            title: 'm',
                            fixedrange: true
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

                    var drawChart = () => {
                        $window.Plotly.newPlot(scope.uniqueId, processData(), layout, settings);
                    };

                    var redrawChart = () => {
                        $window.Plotly.relayout(scope.uniqueId, {});
                    };
                }
            };
        }
    ]);
