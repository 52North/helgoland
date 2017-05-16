angular.module('n52.core.profile')
    .service('providerSelectorService', ['seriesApiInterface', '$q',
        function(seriesApiInterface, $q) {

            var isServiceBlacklisted = (serviceID, url, blacklist) => {
                var isBlacklisted = false;
                blacklist.forEach(entry => {
                    if (entry.serviceID === serviceID && entry.apiUrl === url) {
                        isBlacklisted = true;
                    }
                });
                return isBlacklisted;
            };

            this.fetchProvidersOfAPI = (url, blacklist, filter) => {
                return $q((resolve) => {
                    seriesApiInterface.getServices(url, null, filter)
                        .then(providers => {
                            providers.forEach(provider => {
                                if (!isServiceBlacklisted(provider.id, url, blacklist)) {
                                    provider.providerUrl = url;
                                    resolve(provider);
                                }
                            });
                        });
                });
            };
        }
    ]);
