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
                            this.chartData = this.data[id][0];
                        }
                    }
                };
            }
        ]
    })
    .directive('profileChartD3', ['$window',
        function($window) {
            return {
                restrict: 'EA',
                scope: {
                    data: '='
                },
                link: function(scope, elem) {
                    // get d3
                    var d3 = $window.d3;

                    angular.element($window).bind('resize', () => {
                        drawChart();
                    });

                    scope.$watchCollection('data', () => {
                        drawChart();
                    });

                    // create svg
                    var svg = d3.select(elem[0])
                        .append('svg')
                        .attr('width', '100%')
                        .attr('height', '100%');
                    // set margins
                    var margin = {
                        top: 20,
                        right: 20,
                        bottom: 30,
                        left: 50
                    };
                    // svg element;
                    var rawSvg = elem.find('svg'),
                        graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    var getHeight = () => {
                        return rawSvg.height() - margin.top - margin.bottom;
                    };

                    var getWidth = () => {
                        return rawSvg.width() - margin.left - margin.right;
                    };

                    var drawChart = () => {
                        var data = scope.data.value;
                        graph.selectAll("*").remove();

                        if (data) {
                            var width = getWidth();
                            var height = getHeight();
                            var x = d3.scaleLinear().rangeRound([0, width]);
                            var y = d3.scaleLinear().rangeRound([height, 0]);
                            var line = d3.line()
                                .x(function(d) {
                                    return x(d.value);
                                })
                                .y(function(d) {
                                    return y(d.vertical);
                                });

                            x.domain(d3.extent(data, function(d) {
                                return d.value;
                            }));
                            y.domain(d3.extent(data, function(d) {
                                return d.vertical;
                            }));

                            graph.append("g")
                                // .attr("transform", "translate(0," + height + ")")
                                .call(d3.axisTop(x))
                                .select(".domain");

                            graph.append("g")
                                .call(d3.axisLeft(y));
                            // .append("text")
                            // .attr("fill", "#000")
                            // .attr("transform", "rotate(-90)")
                            // .attr("y", 6)
                            // .attr('x', -10)
                            // .attr("dy", "0.71em")
                            // .attr("text-anchor", "end")
                            // .text("Price ($)");

                            graph.append("path")
                                .datum(data)
                                .attr("fill", "none")
                                .attr("stroke", "steelblue")
                                .attr("stroke-linejoin", "round")
                                .attr("stroke-linecap", "round")
                                .attr("stroke-width", 1.5)
                                .attr("d", line);
                        }
                    };
                }
            };
        }
    ]);
