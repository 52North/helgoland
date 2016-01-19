angular.module('n52.core.profile')
        .config(['$provide',
            function ($provide) {
                $provide.decorator('interfaceService', ['$delegate', '$q', 'statusService', '$http', 'settingsService', 'utils',
                    function ($delegate, $q, statusService, $http, settingsService, utils) {
                        var mockServiceUrl = "js/profile/data/api/v2/";

                        _isMockService = function (url) {
                            return url === mockServiceUrl;
                        };

                        var getServices = $delegate.getServices;
                        $delegate.getServices = function (apiUrl) {
                            if (_isMockService(apiUrl)) {
                                return $q(function (resolve, reject) {
                                    $http.get(apiUrl + 'services.json').then(function (response) {
                                        resolve(response.data.services);
                                    }, function (error) {
                                        _errorCallback(error, reject);
                                    });
                                });
                            } else {
                                return getServices(apiUrl);
                            }
                        };

                        var getFeatures = $delegate.getFeatures;
                        $delegate.getFeatures = function (id, apiUrl, params) {
                            if (_isMockService(apiUrl)) {
                                return $q(function (resolve, reject) {
                                    $http.get(apiUrl + 'features.json').then(function (response) {
                                        resolve(response.data.features);
                                    }, function (error) {
                                        _errorCallback(error, reject);
                                    });
                                });
                            } else {
                                return getFeatures(id, apiUrl, params);
                            }
                        };

                        var getStations = $delegate.getStations;
                        $delegate.getStations = function (apiUrl, params) {
                            if (_isMockService(apiUrl)) {
                                return $q(function (resolve, reject) {
                                    $http.get(apiUrl + 'features.json').then(function (response) {
                                        var stations = [];
                                        angular.forEach(response.data.features, function (feature) {
                                            feature.properties.id = feature.properties.platform;
                                            stations.push(new Station(feature.properties, feature.geometry));
                                        });
                                        resolve(stations);
                                    }, function (error) {
                                        _errorCallback(error, reject);
                                    });
                                });
                            } else {
                                return getStations(apiUrl, params);
                            }
                        };

                        var getTimeseriesForStation = $delegate.getTimeseriesForStation;
                        $delegate.getTimeseriesForStation = function (station, url, params) {
                            if (_isMockService(url)) {
                                return $q(function (resolve, reject) {
                                    $http.get(url + 'platforms/' + station.getId() + "/series.json").then(function (response) {
                                        station.properties.timeseries = {};
                                        angular.forEach(response.data.series, function (series) {
                                            station.properties.timeseries[series.id] = series.parameters;
                                        });
                                        resolve(station);
                                    }, function (error) {
                                        _errorCallback(error, reject);
                                    });
                                });
                            } else {
                                return getTimeseriesForStation(station, url, params);
                            }
                        };

                        var getPhenomena = $delegate.getPhenomena;
                        $delegate.getPhenomena = function (id, apiUrl, params) {
                            if (_isMockService(apiUrl)) {
                                return $q(function (resolve, reject) {
                                    $http.get(apiUrl + 'phenomena.json').then(function (response) {
                                        resolve(response.data.phenomena);
                                    }, function (error) {
                                        _errorCallback(error, reject);
                                    });
                                });
                            } else {
                                return getPhenomena(id, apiUrl, params);
                            }
                        };

                        var getTimeseries = $delegate.getTimeseries;
                        $delegate.getTimeseries = function (id, url, params) {
                            if (_isMockService(url)) {
                                return $q(function (resolve, reject) {
                                    $http.get(url + 'series/' + id + '.json').then(function (response) {
                                        var array = [];
                                        if (response.data.hasOwnProperty('series')) {
                                            angular.forEach(response.data.series, function (s) {
                                                array.push(_createV2Timeseries(utils.createInternalId(s.id, url), url, s));
                                            });
                                            resolve(array);
                                        } else {
                                            resolve(_createV2Timeseries(utils.createInternalId(response.data.id, url), url, response.data));
                                        }
                                    }, function (error) {
                                        _errorCallback(error, reject);
                                    });
                                });
                            } else {
                                return getTimeseries(id, url, params);
                            }
                        };
                        
                        var getTsData = $delegate.getTsData;
                        $delegate.getTsData = function (id, url, params) {
                            if (_isMockService(url)) {
                                return $q(function (resolve, reject) {
                                    $http.get(url + 'series/' + id + '/getData.json').then(function (response) {
                                        resolve(response.data);
                                    }, function (error) {
                                        _errorCallback(error, reject);
                                    });
                                });
                            } else {
                                return getTsData(id, url, params);
                            }
                        };

                        return $delegate;
                    }]);
            }]);