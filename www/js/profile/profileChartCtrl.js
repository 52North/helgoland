angular.module('n52.core.profile')
        .controller('SwcProfileCtrl', ['$scope', 'profileFlotChartServ',
            function ($scope, profileFlotChartService) {
                $scope.options = profileFlotChartService.options;
                $scope.dataset = profileFlotChartService.dataset;
            }])
        .factory('profileFlotChartServ', ['timeseriesService', 'timeService', 'settingsService', 'flotProfileDataHelperServ', '$rootScope',
            function (timeseriesService, timeService, settingsService, flotProfileDataHelperServ, $rootScope) {
                var options = {
                    series: {
                        downsample: {
                            threshold: 0
                        },
                        lines: {
                            show: true,
                            fill: false
                        },
                        shadowSize: 1
                    },
                    points: {
                        show: true
                    },
                    selection: {
                        mode: null
                    },
                    grid: {
                        hoverable: true,
                        autoHighlight: true,
                        margin: {
                            top: 5,
                            left: 5,
                            bottom: 5,
                            right: 5
                        }
                    },
                    crosshair: {
                        mode: 'x'
                    },
                    xaxis: {
                        position: "top"
                    },
                    yaxis: {
                        show: true,
                        additionalWidth: 17,
                        panRange: false,
                        min: null,
                        labelWidth: 50
                    },
                    legend: {
                        show: false
                    },
                    pan: {
                        interactive: true,
                        frameRate: 10
                    }
                };
                angular.merge(options, settingsService.chartOptions);
                var renderOptions = {
                    showRefValues: true,
                    showSelection: true,
                    showActive: true
                };
                var dataset = createDataSet();
//                setTimeExtent();

                $rootScope.$on('profilesDataChanged', function (evt, internalId) {
                    flotProfileDataHelperServ.updateDataSet(dataset, renderOptions, internalId);
                });
                
                $rootScope.$on('profilesTimestampChanged', function (evt, internalId) {
                    flotProfileDataHelperServ.updateDataSet(dataset, renderOptions, internalId);
                });

//                $rootScope.$on('timeseriesChanged', function (evt, id) {
//                    createYAxis();
//                    flotDataHelperServ.updateTimeseriesInDataSet(dataset, renderOptions, id, timeseriesService.getData(id));
//                });

//                $rootScope.$on('allTimeseriesChanged', function () {
//                    createYAxis();
//                    flotDataHelperServ.updateAllTimeseriesToDataSet(dataset, renderOptions, timeseriesService.getAllTimeseries());
//                });

//                $rootScope.$on('timeseriesDataChanged', function (evt, id) {
//                    createYAxis();
//                    flotDataHelperServ.updateTimeseriesInDataSet(dataset, renderOptions, id, timeseriesService.getData(id));
//                });

//                $rootScope.$on('timeExtentChanged', function () {
//                    setTimeExtent();
//                });

//                function setTimeExtent() {
//                    options.xaxis.min = timeService.time.start.toDate().getTime();
//                    options.xaxis.max = timeService.time.end.toDate().getTime();
//                }

//                function createYAxis() {
//                    var axesList = {};
//                    angular.forEach(timeseriesService.getAllTimeseries(), function (elem) {
//                        if (elem.styles.groupedAxis === undefined || elem.styles.groupedAxis) {
//                            if (!axesList.hasOwnProperty(elem.uom)) {
//                                axesList[elem.uom] = {
//                                    id: ++Object.keys(axesList).length,
//                                    uom: elem.uom,
//                                    tsColors: [elem.styles.color],
//                                    zeroScaled: elem.styles.zeroScaled
//                                };
//                                elem.styles.yaxis = axesList[elem.uom].id;
//                            } else {
//                                axesList[elem.uom].tsColors.push(elem.styles.color);
//                                elem.styles.yaxis = axesList[elem.uom].id;
//                            }
//                        } else {
//                            axesList[elem.id] = {
//                                id: ++Object.keys(axesList).length,
//                                uom: elem.uom + " @ " + elem.station.properties.label,
//                                tsColors: [elem.styles.color],
//                                zeroScaled: elem.styles.zeroScaled
//                            };
//                            elem.yaxis = axesList[elem.id].id;
//                        }
//                    });
//                    var axes = [];
//                    angular.forEach(axesList, function (elem) {
//                        axes.splice(elem.id - 1, 0, {
//                            uom: elem.uom,
//                            tsColors: elem.tsColors,
//                            min: elem.zeroScaled ? 0 : options.yaxis.min
//                        });
//                    });
//                    options.yaxes = axes;
//                }

                function createDataSet() {
//                    createYAxis();
                    var dataset = [];
                    flotProfileDataHelperServ.updateAllDataSet(dataset, renderOptions);
                    return dataset;
                }

                return {
                    dataset: dataset,
                    options: options
                };
            }])
        .factory('flotProfileDataHelperServ', ['profilesService',
            function (profilesService) {
                _createProfileData = function (values, timestamp) {
                    var data = [];
                    angular.forEach(values, function (value) {
                        if (value.timestamp === timestamp) {
                            angular.forEach(value.profile, function (entry) {
                                data.push([entry.value, entry.vertical]);
                            });
                        }
                    });
                    return data;
                };
                _createEntry = function (internalId, renderOptions) {
                    return {
                        id: internalId
                    };
                };
                _getEntry = function (dataset, internalId, renderOptions) {
                    var entry;
                    angular.forEach(dataset, function (data) {
                        if (data.id === internalId)
                            entry = data;
                    });
                    if (!entry) {
                        entry = _createEntry(internalId, renderOptions);
                        dataset.push(entry);
                    }
                    return entry;
                };
                _removeEntry = function (dataset, internalId) {
                    var idx;
                    angular.forEach(dataset, function (data, i) {
                        if (data.id === internalId)
                            idx = i;
                    });
                    if (angular.isNumber(idx)) {
                        dataset.splice(idx, 1);
                    }
                };
                _updateEntryData = function (entry, data) {
                    entry.data = data;
                };
                updateAllDataSet = function (dataset, renderOptions) {
                    angular.forEach(profilesService.getAllProfiles(), function (profile) {
                        updateDataSet(dataset, renderOptions, profile.internalId);
                    });
                };
                updateDataSet = function (dataset, renderOptions, internalId) {
                    var profile = profilesService.getProfile(internalId);
                    if (profile && !profile.style.hidden) {
                        var timestamp = profile.selectedTime;
                        var data = _createProfileData(profilesService.getData(internalId), timestamp);
                        _updateEntryData(_getEntry(dataset, internalId, renderOptions), data);
                    } else {
                        _removeEntry(dataset, internalId);
                    }
                };
                return {
                    updateDataSet: updateDataSet,
                    updateAllDataSet: updateAllDataSet
                };
            }])
        .service('flotProfilePanHandler', [
            function () {
                this.plotPanEnd = function () {
                };
            }]);