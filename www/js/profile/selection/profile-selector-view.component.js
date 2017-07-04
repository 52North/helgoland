import 'n52-sensorweb-client-core/src/js/selection/provider-selector/component';

angular.module('n52.core.profile')
    .component('swcProfileSelectorView', {
        template: require('../../../templates/profile/profile-selection-view.html'),
        controller: ['settingsService', 'profileSelectorPermalinkSrvc', '$uibModal', 'swcProfileSelectorViewStateSrvc',
            function(settingsService, profileSelectorPermalinkSrvc, $uibModal, swcProfileSelectorViewStateSrvc) {

                this.tabActive = 0;
                var valueType = 'quantity-profile';

                this.layers = {
                    baselayers: settingsService.baselayer,
                    overlays: settingsService.overlays
                };
                this.cluster = true;

                var createFilter = () => {
                    var filter = {
                        valueTypes: valueType
                    };
                    if (this.selectedProvider) filter.service = this.selectedProvider.id;
                    if (this.selectedOffering) filter.offering = this.selectedOffering.id;
                    if (this.selectedPhenomenon) filter.phenomenon = this.selectedPhenomenon.id;
                    if (this.selectedProcedure) {
                        filter.procedure = this.selectedProcedure.id;
                        filter.expanded = true;
                    }
                    return filter;
                };

                var setSelectedProvider = (provider) => {
                    this.selectedProvider = swcProfileSelectorViewStateSrvc.selectedProvider = provider;
                };

                var setSelectedOffering = (offering) => {
                    this.selectedOffering = swcProfileSelectorViewStateSrvc.selectedOffering = offering;
                };

                var setSelectedPhenomenon = (phenomenon) => {
                    this.selectedPhenomenon = swcProfileSelectorViewStateSrvc.selectedPhenomenon = phenomenon;
                };

                var setSelectedProcedure = (procedure) => {
                    this.selectedProcedure = swcProfileSelectorViewStateSrvc.selectedProcedure = procedure;
                };

                this.$onInit = () => {
                    profileSelectorPermalinkSrvc.validatePermalink().then(() => {
                        if (swcProfileSelectorViewStateSrvc.selectedProvider) this.providerSelected(swcProfileSelectorViewStateSrvc.selectedProvider);
                        if (swcProfileSelectorViewStateSrvc.selectedOffering) this.offeringSelected(swcProfileSelectorViewStateSrvc.selectedOffering);
                        if (swcProfileSelectorViewStateSrvc.selectedPhenomenon) this.phenomenonSelected(swcProfileSelectorViewStateSrvc.selectedPhenomenon);
                        if (swcProfileSelectorViewStateSrvc.selectedProcedure) this.procedureSelected(swcProfileSelectorViewStateSrvc.selectedProcedure);
                    });
                    this.providerList = settingsService.restApiUrls;
                    this.providerBlacklist = settingsService.providerBlackList;
                    this.providerFilter = createFilter();
                };

                this.providerSelected = (provider, clearPrevious) => {
                    this.tabActive = 1;
                    if (clearPrevious) {
                        setSelectedOffering(null);
                        setSelectedPhenomenon(null);
                        setSelectedProcedure(null);
                    }
                    setSelectedProvider(provider);
                    this.offeringFilter = createFilter();
                };

                this.offeringSelected = (offering, clearPrevious) => {
                    this.tabActive = 2;
                    if (clearPrevious) {
                        setSelectedPhenomenon(null);
                        setSelectedProcedure(null);
                    }
                    setSelectedOffering(offering);
                    this.phenomenonFilter = createFilter();
                };

                this.phenomenonSelected = (phenomenon, clearPrevious) => {
                    this.tabActive = 3;
                    if (clearPrevious) {
                        setSelectedProcedure(null);
                    }
                    setSelectedPhenomenon(phenomenon);
                    this.procedureFilter = createFilter();
                };

                this.procedureSelected = (procedure) => {
                    this.tabActive = 4;
                    setSelectedProcedure(procedure);
                    this.platformFilter = createFilter();
                };

                this.platformSelected = (platform) => {
                    this.selectedPlatform = platform;
                    $uibModal.open({
                        animation: true,
                        templateUrl: 'n52.core.map.stationary-insitu',
                        resolve: {
                            selection: () => {
                                return {
                                    stationId: platform.id,
                                    phenomenonId: this.selectedPhenomenon.id,
                                    url: swcProfileSelectorViewStateSrvc.selectedProvider.providerUrl
                                };
                            }
                        },
                        controller: 'SwcModalStationaryInsituCtrl'
                    });
                };
            }
        ]
    })
    .component('swcProfileSelectorPermalink', {
        template: require('../../../templates/menu/permalink.html'),
        controller: ['profileSelectorPermalinkSrvc', 'permalinkOpener',
            function(profileSelectorPermalinkSrvc, permalinkOpener) {
                this.permalink = () => {
                    permalinkOpener.openPermalink(profileSelectorPermalinkSrvc.createPermalink());
                };
            }
        ]
    })
    .service('profileSelectorPermalinkSrvc', ['$location', 'seriesApiInterface', 'swcProfileSelectorViewStateSrvc', '$q',
        function($location, seriesApiInterface, swcProfileSelectorViewStateSrvc, $q) {
            var providerUrlParam = 'url';
            var providerIdParam = 'id';
            var offeringParam = 'offering';
            var phenomenonParam = 'phenomenon';
            var procedureParam = 'procedure';

            this.createPermalink = () => {
                var parameter = '';
                if (swcProfileSelectorViewStateSrvc.selectedProvider) {
                    parameter += providerUrlParam + '=' + swcProfileSelectorViewStateSrvc.selectedProvider.providerUrl;
                    parameter += '&' + providerIdParam + '=' + swcProfileSelectorViewStateSrvc.selectedProvider.id;
                    if (swcProfileSelectorViewStateSrvc.selectedOffering) {
                        parameter += '&' + offeringParam + '=' + swcProfileSelectorViewStateSrvc.selectedOffering.id;
                        if (swcProfileSelectorViewStateSrvc.selectedPhenomenon) {
                            parameter += '&' + phenomenonParam + '=' + swcProfileSelectorViewStateSrvc.selectedPhenomenon.id;
                            if (swcProfileSelectorViewStateSrvc.selectedProcedure) {
                                parameter += '&' + procedureParam + '=' + swcProfileSelectorViewStateSrvc.selectedProcedure.id;
                            }
                        }
                    }
                }
                if (parameter) {
                    return $location.absUrl() + '?' + parameter;
                } else {
                    return $location.absUrl();
                }
            };

            this.validatePermalink = () => {
                return $q((resolve) => {
                    if ($location.search()[providerUrlParam] && $location.search()[providerIdParam]) {
                        var url = $location.search()[providerUrlParam];
                        seriesApiInterface.getServices(url, $location.search()[providerIdParam])
                            .then(res => {
                                res.providerUrl = url;
                                swcProfileSelectorViewStateSrvc.selectedProvider = res;
                                if ($location.search()[offeringParam]) {
                                    seriesApiInterface.getOfferings($location.search()[offeringParam], url)
                                        .then(offering => {
                                            swcProfileSelectorViewStateSrvc.selectedOffering = offering;
                                            if ($location.search()[phenomenonParam]) {
                                                seriesApiInterface.getPhenomena($location.search()[phenomenonParam], url)
                                                    .then(phenomenon => {
                                                        swcProfileSelectorViewStateSrvc.selectedPhenomenon = phenomenon;
                                                        if ($location.search()[procedureParam]) {
                                                            seriesApiInterface.getProcedures($location.search()[procedureParam], url)
                                                                .then(procedure => {
                                                                    swcProfileSelectorViewStateSrvc.selectedProcedure = procedure;
                                                                });
                                                        } else {
                                                            resolve();
                                                        }
                                                    });
                                            } else {
                                                resolve();
                                            }
                                        });
                                } else {
                                    resolve();
                                }
                            });
                    } else {
                        resolve();
                    }
                });
            };
        }
    ])
    .service('swcProfileSelectorViewStateSrvc', [
        function() {}
    ]);
