import 'n52-sensorweb-client-core/src/js/permalink/simple-permalink-button/component';
import 'n52-sensorweb-client-core/src/js/permalink/permalink-in-mail/component';
import 'n52-sensorweb-client-core/src/js/permalink/permalink-new-window/component';
import 'n52-sensorweb-client-core/src/js/permalink/permalink-to-clipboard/component';

angular.module('n52.core.timeseries')
    .component('swcTimeseriesDiagramView', {
        template: require('../../../templates/timeseries/timeseries-diagram-view.html'),
        controller: ['timeseriesDiagramPermalinkSrvc',
            function(timeseriesDiagramPermalinkSrvc) {
                this.$onInit = () => {
                    timeseriesDiagramPermalinkSrvc.validatePermalink();
                };

                this.createPermalink = () => {
                    return timeseriesDiagramPermalinkSrvc.createPermalink(true);
                };
            }
        ]
    })
    .service('timeseriesDiagramPermalinkSrvc', ['timeseriesService', 'timeService', '$location', '$state',
        function(timeseriesService, timeService, $location, $state) {
            var seriesParam = 'series';
            var timeParam = 'time';
            var paramSeparator = '|';
            var paramBlockSeparator = '!!';

            this.createPermalink = (withTime) => {
                var parameters = [];
                var location = $state.href('timeseries.diagram', null, {
                    absolute: true
                });
                for (var id in timeseriesService.timeseries) {
                    if (timeseriesService.timeseries.hasOwnProperty(id)) {
                        var series = timeseriesService.getTimeseries(id);
                        parameters.push(series.apiUrl + paramSeparator + series.id);
                    }
                }
                if (parameters.length > 0) {
                    var url = location + '?' + seriesParam + '=' + encodeURIComponent(parameters.join(paramBlockSeparator));
                    if (withTime) {
                        url = url + '&' + timeParam + '=' + timeService.getStartInMillies() + paramSeparator + timeService.getEndInMillies();
                    }
                    return url;
                } else {
                    return location;
                }
            };

            this.validatePermalink = () => {
                if($location.search()[timeParam]) {
                    var timespan = $location.search()[timeParam].split(paramSeparator);
                    if (timespan.length === 2) {
                        var start = moment(parseInt(timespan[0]));
                        var end = moment(parseInt(timespan[1]));
                        timeService.setFlexibleTimeExtent(start, end);
                    }
                }
                if($location.search()[seriesParam]) {
                    timeseriesService.removeAllTimeseries();
                    var params = $location.search()[seriesParam].split(paramBlockSeparator);
                    params.forEach(entry => {
                        var seriesParam = entry.split(paramSeparator);
                        if (seriesParam.length === 2) {
                            var id = seriesParam[1];
                            var url = seriesParam[0];
                            timeseriesService.addTimeseriesById(id, url);
                        }
                    });
                }
            };
        }
    ]);
