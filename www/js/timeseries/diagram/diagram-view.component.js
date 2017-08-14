require('n52-sensorweb-client-core/src/js/permalink/simple-permalink-button/component');
require('n52-sensorweb-client-core/src/js/permalink/permalink-in-mail/component');
require('n52-sensorweb-client-core/src/js/permalink/permalink-new-window/component');
require('n52-sensorweb-client-core/src/js/permalink/permalink-to-clipboard/component');
require('n52-sensorweb-client-core/src/js/permalink/service/permalink-service');
require('n52-sensorweb-client-core/src/js/Legend/geometry-map-viewer/component');

angular.module('n52.core.timeseries')
    .component('swcTimeseriesDiagramView', {
        template: require('./diagram-view.component.html'),
        controller: ['timeseriesDiagramPermalinkSrvc', 'timeseriesService', 'SetTimeseriesOfStatusService',
            function(timeseriesDiagramPermalinkSrvc, timeseriesService, SetTimeseriesOfStatusService) {

                SetTimeseriesOfStatusService.setsParameters();
                
                this.timeseries = timeseriesService.timeseries;

                this.$onInit = () => {
                    timeseriesDiagramPermalinkSrvc.validatePermalink();
                };

                this.createPermalink = () => {
                    return timeseriesDiagramPermalinkSrvc.createPermalink(true);
                };

                this.hasTimeseries = () => {
                    return (timeseriesService.getTimeseriesCount() > 0);
                };
            }
        ]
    })
    .component('swcDiagramPermalinkButton', {
        bindings: {
            generatedUrlFunction: '<'
        },
        templateUrl: 'n52.core.permalink.button',
        controller: ['permalinkOpener', '$uibModal',
            function(permalinkOpener, $uibModal) {
                this.permalink = () => {
                    $uibModal.open({
                        animation: true,
                        template: require('./diagram-permalink-window.html'),
                        controller: ['$scope', '$uibModalInstance', 'timeseriesDiagramPermalinkSrvc',
                            function($scope, $uibModalInstance, timeseriesDiagramPermalinkSrvc) {
                                $scope.useTime = true;

                                $scope.$watch('useTime', function() {
                                    $scope.url = timeseriesDiagramPermalinkSrvc.createPermalink($scope.useTime);
                                }, true);

                                $scope.close = () => {
                                    $uibModalInstance.close();
                                };
                            }
                        ]
                    });
                };
            }
        ]
    })
    .component('swcTimeseriesGeometryViewButton', {
        bindings: {
            series: '<'
        },
        template: require('../../../templates/legend/location-button.html'),
        controller: ['$uibModal', 'constants', 'seriesApiInterface',
            function($uibModal, constants, seriesApiInterface) {
                var openModal = (header, geometry) => {
                    $uibModal.open({
                        animation: true,
                        template: require('../../../templates/legend/location-modal.html'),
                        resolve: {
                            data: () => {
                                return {
                                    header: header,
                                    geometry: geometry
                                };
                            }
                        },
                        controller: ['$scope', 'data', '$uibModalInstance',
                            function($scope, data, $uibModalInstance) {
                                $scope.header = data.header;
                                $scope.geometry = data.geometry;

                                $scope.close = () => {
                                    $uibModalInstance.close();
                                };
                            }
                        ]
                    });
                };

                this.openGeometryView = () => {
                    if (this.series.valueType === constants.valueType.quantity) {
                        seriesApiInterface.getPlatforms(this.series.seriesParameters.platform.id, this.series.apiUrl)
                            .then(platform => {
                                openModal(platform.label, platform.geometry);
                            });
                    } else {
                        openModal(this.series.station.properties.label, this.series.station.geometry);
                    }
                };
            }
        ]
    })
    .service('timeseriesDiagramPermalinkSrvc', ['timeseriesService', 'timeService', '$location', '$q', 'seriesApiInterface', 'permalinkService',
        function(timeseriesService, timeService, $location, $q, seriesApiInterface, permalinkService) {
            var seriesParam = 'series';
            var timeParam = 'time';
            var paramSeparator = '|';
            var paramBlockSeparator = '!!';

            this.createPermalink = (withTime) => {
                var parameters = [];
                for (var id in timeseriesService.timeseries) {
                    if (timeseriesService.timeseries.hasOwnProperty(id)) {
                        var series = timeseriesService.getTimeseries(id);
                        parameters.push(series.apiUrl + paramSeparator + series.id);
                    }
                }
                if (parameters.length > 0) {
                    var url = permalinkService.createBaseUrl() + '?' + seriesParam + '=' + encodeURIComponent(parameters.join(paramBlockSeparator));
                    if (withTime) {
                        url = url + '&' + timeParam + '=' + timeService.getStartInMillies() + paramSeparator + timeService.getEndInMillies();
                    }
                    return url;
                } else {
                    return permalinkService.createBaseUrl();
                }
            };

            this.validatePermalink = () => {
                var timeset = false;
                if ($location.search()[timeParam]) {
                    var timespan = $location.search()[timeParam].split(paramSeparator);
                    if (timespan.length === 2) {
                        var start = moment(parseInt(timespan[0]));
                        var end = moment(parseInt(timespan[1]));
                        timeService.setFlexibleTimeExtent(start, end);
                    }
                    timeset = true;
                }
                if ($location.search()[seriesParam]) {
                    timeseriesService.removeAllTimeseries();
                    var params = $location.search()[seriesParam].split(paramBlockSeparator);
                    if (timeset) {
                        params.forEach(entry => {
                            var seriesParam = entry.split(paramSeparator);
                            if (seriesParam.length === 2) {
                                var id = seriesParam[1];
                                var url = seriesParam[0];
                                timeseriesService.addTimeseriesById(id, url);
                            }
                        });
                    } else {

                        var promises = [];
                        end = null;

                        params.forEach(entry => {
                            var seriesParam = entry.split(paramSeparator);
                            if (seriesParam.length === 2) {
                                var id = seriesParam[1];
                                var url = seriesParam[0];
                                promises.push(seriesApiInterface.getTimeseries(id, url).then(
                                    (result) => {
                                        if (result.lastValue && result.lastValue.timestamp) {
                                            if (end == null || end.isBefore(moment(result.lastValue.timestamp))) {
                                                end = moment(result.lastValue.timestamp);
                                            }
                                        }
                                    }
                                ));
                            }
                        });

                        $q.all(promises).then(() => {
                            var start = moment(end).subtract(2, 'days');
                            timeService.setFlexibleTimeExtent(start, end);
                            params.forEach(entry => {
                                var seriesParam = entry.split(paramSeparator);
                                if (seriesParam.length === 2) {
                                    var id = seriesParam[1];
                                    var url = seriesParam[0];
                                    timeseriesService.addTimeseriesById(id, url);
                                }
                            });
                        });
                    }
                }
            };
        }
    ]);
