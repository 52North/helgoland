angular.module('n52.core.interface')
    .service('interfaceV2Service', ['$http', '$q', 'interfaceServiceUtils', 'utils',
        function($http, $q, interfaceServiceUtils, utils) {

            this.getMobilePlatforms = function(id, apiUrl, params) {
                return $q(function(resolve, reject) {
                    $http.get(apiUrl + 'platforms/' + interfaceServiceUtils.createIdString(id), interfaceServiceUtils.createRequestConfigs(params))
                        .then(function(response) {
                            resolve(response.data);
                        }, function(error) {
                            interfaceServiceUtils.errorCallback(error, reject);
                        });
                });
            };

            this.getFeatures = function(id, apiUrl, params) {
                return $q(function(resolve, reject) {
                    $http.get(apiUrl + 'features/' + interfaceServiceUtils.createIdString(id), interfaceServiceUtils.createRequestConfigs(params))
                        .then(function(response) {
                            resolve(response.data);
                        }, function(error) {
                            interfaceServiceUtils.errorCallback(error, reject);
                        });
                });
            };

            this.getPhenomena = function(id, apiUrl, params) {
                return $q(function(resolve, reject) {
                    $http.get(apiUrl + 'phenomena/' + interfaceServiceUtils.createIdString(id), interfaceServiceUtils.createRequestConfigs(params))
                        .then(function(response) {
                            resolve(response.data);
                        }, function(error) {
                            interfaceServiceUtils.errorCallback(error, reject);
                        });
                });
            };

            this.getDatasets = function(id, apiUrl, params) {
                return $q(function(resolve, reject) {
                    $http.get(apiUrl + 'datasets/' + interfaceServiceUtils.createIdString(id), interfaceServiceUtils.createRequestConfigs(params))
                        .then(function(response) {
                            resolve(response.data);
                        }, function(error) {
                            interfaceServiceUtils.errorCallback(error, reject);
                        });
                });
            };

            this.getDatasetData = function(id, apiUrl, timespan, extendedParams) {
                var params = {
                    timespan: utils.createRequestTimespan(timespan.start, timespan.end)
                };
                if (extendedParams) {
                    angular.extend(params, extendedParams);
                }
                return $q(function(resolve, reject) {
                    $http.get(apiUrl + 'datasets/' + interfaceServiceUtils.createIdString(id) + '/data', interfaceServiceUtils.createRequestConfigs(params))
                        .then(function(response) {
                            resolve(response.data);
                        }, function(error) {
                            interfaceServiceUtils.errorCallback(error, reject);
                        });
                });
            };
        }
    ]);
