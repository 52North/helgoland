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

                $rootScope.$on('profilesDataChanged', function (evt, internalId) {
                    flotProfileDataHelperServ.updateDataSet(dataset, renderOptions, internalId);
                });

                $rootScope.$on('profilesTimestampChanged', function (evt, internalId) {
                    flotProfileDataHelperServ.updateDataSet(dataset, renderOptions, internalId);
                });

                function createDataSet() {
                    var dataset = [];
                    flotProfileDataHelperServ.updateAllDataSet(dataset, renderOptions);
                    return dataset;
                }

                return {
                    dataset: dataset,
                    options: options
                };
            }])
        .factory('flotProfileDataHelperServ', ['profilesService', 'settingsService',
            function (profilesService, settingsService) {
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
                _updateEntry = function (entry, profile, renderOptions) {
                    var lineWidth = settingsService.commonLineWidth,
                            selected = profile.style.selected && renderOptions.showSelection;
                    if (selected)
                        lineWidth = settingsService.selectedLineWidth;
                    angular.merge(entry, {
                        selected: selected,
                        color: profile.style.color,
                        lines: {
                            lineWidth: lineWidth
                        }
                    });
                };
                _updatePermaEntries = function (dataset, profile) {
                    angular.forEach(profile.permaProfiles, function (permaProfile, timestamp) {
                        var exists = false;
                        angular.forEach(dataset, function (data) {
                            if (data.id === profile.internalId + '@time:' + timestamp) {
                                exists = true;
                                data.color = permaProfile.color;
                            }
                        });
                        if (!exists) {
                            dataset.push({
                                id: profile.internalId + '@time:' + timestamp,
                                data: _createProfileData(profilesService.getData(profile.internalId), parseInt(timestamp)),
                                color: permaProfile.color
                            });
                        }
                    });
                    _removePermaEntry(dataset, profile);
                };
                _removePermaEntry = function (dataset, profile) {
                    var removeData;
                    angular.forEach(dataset, function (data, idx) {
                        if (data.id.indexOf(profile.internalId) >= 0 && data.id.indexOf('@time:') > 0) {
                            var timestamp = data.id.substring(data.id.indexOf('@time:') + 6, data.id.length);
                            if (!profile.permaProfiles[timestamp])
                                removeData = idx;
                        }
                    });
                    if (removeData) {
                        dataset.splice(removeData, 1);
                    }
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
                        var entry = _getEntry(dataset, internalId, renderOptions);
                        _updateEntryData(entry, data);
                        _updateEntry(entry, profile, renderOptions);
                        _updatePermaEntries(dataset, profile);
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