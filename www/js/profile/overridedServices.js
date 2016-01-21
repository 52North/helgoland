angular.module('n52.core.profile')
        .config(['$provide',
            function ($provide) {
                $provide.decorator('SetTimeseriesOfStatusService', ['$delegate', 'statusService', 'profilesService', 'timeseriesService', 'permalinkEvaluationService',
                    function ($delegate, statusService, profilesService, timeseriesService, permalinkEvaluationService) {
                        $delegate.setsParameters = function () {
                            // don't add timeseries of the status service when adding timeseries by permalink
                            var hasTsParam = permalinkEvaluationService.hasParam('ts');
                            if (!hasTsParam) {
                                angular.forEach(statusService.getTimeseries(), function (series) {
                                    switch (series.type) {
                                        case 'profile':
                                            profilesService.addProfiles(series);
                                            break;
                                        default:
                                            timeseriesService.addTimeseriesById(series.id, series.apiUrl);
                                    }
                                });
                            } else {
                                statusService.removeAllTimeseries();
                            }
                        };

                        return $delegate;
                    }]);
                $provide.decorator('permalinkGenerationService', ['$delegate', 'timeService', '$location', 'timeseriesService', 'profilesService', 'utils',
                    function ($delegate, timeService, $location, timeseriesService, profilesService, utils) {
                        createTimeseriesParam = function (timeseriesId) {
                            var ids = [];
                            if (angular.isUndefined(timeseriesId)) {
                                angular.forEach(timeseriesService.getAllTimeseries(), function (elem) {
                                    ids.push(elem.internalId);
                                });
                                angular.forEach(profilesService.getAllProfiles(), function (elem) {
                                    ids.push(elem.internalId);
                                });
                            } else {
                                ids.push(timeseriesId);
                            }
                            return "ts=" + encodeURIComponent(ids.join());
                        };
                        createTimeParam = function () {
                            var timespan = timeService.getCurrentTimespan();
                            return "timespan=" + encodeURIComponent(utils.createRequestTimespan(timespan.start, timespan.end));
                        };
                        $delegate.getCurrentPermalink = function (timeseriesId) {
                            var params = [];
                            var url = $location.absUrl();
                            var link;
                            if (url.indexOf('?') > 0) {
                                link = $location.absUrl().substring(0, $location.absUrl().indexOf('?'));
                            } else {
                                link = $location.absUrl();
                            }
                            link = link + '?';
                            // create timespan
                            params.push(createTimeParam());
                            // create id list
                            params.push(createTimeseriesParam(timeseriesId));
                            return link + params.join("&");
                        };

                        return $delegate;
                    }]);

                $provide.decorator('SetInternalTimeseriesService', ['$delegate', 'permalinkEvaluationService', 'interfaceService', 'timeseriesService', 'profilesService', 'utils',
                    function ($delegate, permalinkEvaluationService, interfaceService, timeseriesService, profilesService, utils) {
                        $delegate.setsParameters = function () {
                            var timeseries = permalinkEvaluationService.getParam("ts");
                            if (timeseries) {
                                var timeseriesObject = {};
                                angular.forEach(timeseries.split(","), function (internalID) {
                                    var comb = utils.getTimeseriesCombinationByInternalId(internalID);
                                    if (Object.keys(comb).length > 0) {
                                        interfaceService.getTimeseries(comb.id, comb.apiUrl).then(function (data) {
                                            switch (data.type) {
                                                case 'profile':
                                                    profilesService.addProfiles(data);
                                                    break;
                                                default:
                                                    timeseriesService.addTimeseriesById(comb.id, comb.apiUrl);
                                            }
                                        });
                                    }
                                });
                                return timeseriesObject;
                            }
                            return null;
                        };

                        return $delegate;
                    }]);
            }]);