angular.module('n52.core.profile')
    .config(['$provide',
        function($provide) {
            $provide.decorator('seriesApiV2Interface', ['$delegate', '$q', 'statusService', '$http', 'settingsService', 'utils', 'interfaceUtils',
                function($delegate, $q, statusService, $http, settingsService, utils, interfaceUtils) {
                    var mockServiceUrl = "data/api/v1/";

                    var _isMockService = (url) => {
                        return url === mockServiceUrl;
                    };

                    var getServices = $delegate.getServices;
                    $delegate.getServices = (id, apiUrl) => {
                        if (_isMockService(apiUrl)) {
                            return $q((resolve, reject) => {
                                $http.get(apiUrl + 'services.json')
                                    .then(
                                        (response) => resolve(response.data),
                                        (error) => interfaceUtils.errorCallback(error, reject)
                                    );
                            });
                        } else {
                            return getServices(id, apiUrl);
                        }
                    };

                    var getFeatures = $delegate.getFeatures;
                    $delegate.getFeatures = (id, apiUrl, params) => {
                        if (_isMockService(apiUrl)) {
                            return $q((resolve, reject) => {
                                $http.get(apiUrl + 'features.json')
                                    .then(
                                        (response) => resolve(response.data.features),
                                        (error) => interfaceUtils.errorCallback(error, reject)
                                    );
                            });
                        } else {
                            return getFeatures(id, apiUrl, params);
                        }
                    };

                    var getStations = $delegate.getStations;
                    $delegate.getStations = (id, apiUrl, params) => {
                        if (_isMockService(apiUrl)) {
                            return $q((resolve, reject) => {
                                $http.get(apiUrl + 'platforms.json')
                                    .then(
                                        (response) => {
                                            if (isNaN(response.data.length)) {
                                                response.data.properties = {
                                                    id: response.data.id,
                                                    timeseries: response.data.datasets
                                                };
                                            } else {
                                                angular.forEach(response.data, (entry) => {
                                                    entry.properties = {
                                                        id: entry.id,
                                                        timeseries: entry.datasets
                                                    };
                                                });
                                            }
                                            resolve(response.data);
                                        },
                                        (error) => interfaceUtils.errorCallback(error, reject)
                                    );
                            });
                        } else {
                            return getStations(id, apiUrl, params);
                        }
                    };

                    var getPhenomena = $delegate.getPhenomena;
                    $delegate.getPhenomena = (id, apiUrl, params) => {
                        if (_isMockService(apiUrl)) {
                            return $q((resolve, reject) => {
                                $http.get(apiUrl + 'phenomena.json')
                                    .then((response) => {
                                        resolve(response.data);
                                    }, (error) => {
                                        interfaceUtils.errorCallback(error, reject);
                                    });
                            });
                        } else {
                            return getPhenomena(id, apiUrl, params);
                        }
                    };

                    var getPlatforms = $delegate.getPlatforms;
                    $delegate.getPlatforms = (id, apiUrl, params) => {
                        if (_isMockService(apiUrl)) {
                            return $q((resolve, reject) => {
                                $http.get(apiUrl + 'platforms/' + id + ".json")
                                    .then(
                                        (response) => resolve(response.data),
                                        (error) => interfaceUtils.errorCallback(error, reject)
                                    );
                            });
                        } else {
                            return getPlatforms(id, apiUrl, params);
                        }
                    };

                    var getDatasets = $delegate.getDatasets;
                    $delegate.getDatasets = (id, apiUrl, params) => {
                        if (_isMockService(apiUrl)) {
                            return $q((resolve, reject) => {
                                $http.get(apiUrl + 'datasets/' + id + ".json")
                                    .then(
                                        (response) => resolve(response.data),
                                        (error) => interfaceUtils.errorCallback(error, reject)
                                    );
                            });
                        } else {
                            return getDatasets(id, apiUrl, params);
                        }
                    };

                    var getDatasetData = $delegate.getDatasetData;
                    $delegate.getDatasetData = (id, apiUrl, timespan, params) => {
                        if (_isMockService(apiUrl)) {
                            return $q((resolve, reject) => {
                                $http.get(apiUrl + 'datasets/data/' + id + '.json')
                                    .then(
                                        (response) => resolve(response.data),
                                        (error) => interfaceUtils.errorCallback(error, reject)
                                    );
                            });
                        } else {
                            return getDatasetData(id, apiUrl, timespan, params);
                        }
                    };

                    return $delegate;
                }
            ]);
        }
    ]);
