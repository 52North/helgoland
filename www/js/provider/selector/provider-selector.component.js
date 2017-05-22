angular.module('n52.core.profile')
    .component('providerSelector', {
        bindings: {
            providerList: '<',
            providerBlacklist: '<',
            filter: '<',
            providerSelected: "&onProviderSelected",
        },
        templateUrl: 'n52.core.provider.provider-selector',
        controller: ['providerSelectorService',
            function(providerSelectorService) {
                this.$onInit = function() {
                    var list = this.providerList;
                    if (!Array.isArray(list)) list = Object.keys(list);
                    this.loadingCount = list.length;
                    this.providers = [];
                    list.forEach(url => {
                        providerSelectorService.fetchProvidersOfAPI(url, this.providerBlacklist, this.filter)
                            .then(
                                res => {
                                    this.loadingCount--;
                                    res.forEach(entry => {
                                        if (entry.quantities.platforms > 0) {
                                            this.providers.push(entry);
                                        }
                                    });
                                },
                                () => {
                                    this.loadingCount--;
                                }
                            );
                    });
                };
                this.selectProvider = function(provider) {
                    this.providerSelected({
                        provider: provider
                    });
                };
            }
        ]
    });
