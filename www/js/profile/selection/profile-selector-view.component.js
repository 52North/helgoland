angular.module('n52.core.profile')
    .component('swcProfileSelectorView', {
        bindings: {
            series: '<'
        },
        template: require('../../../templates/profile/profileSelection.html'),
        controller: ['settingsService', '$location', '$uibModal', 'swcProfileSelectorViewStateSrvc',
            function(settingsService, $location, $uibModal, swcProfileSelectorViewStateSrvc) {
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

                var initProvider = (url) => {
                    if (url) this.providerSelected({
                        providerUrl: url
                    });
                    if (swcProfileSelectorViewStateSrvc.selectedProvider) this.providerSelected(swcProfileSelectorViewStateSrvc.selectedProvider);
                };

                var initOffering = (id) => {
                    id = parseInt(id);
                    if (Number.isInteger(id)) this.offeringSelected({
                        id: id
                    });
                    if (swcProfileSelectorViewStateSrvc.selectedOffering) this.offeringSelected(swcProfileSelectorViewStateSrvc.selectedOffering);
                };

                var initPhenomenon = (id) => {
                    id = parseInt(id);
                    if (Number.isInteger(id)) this.phenomenonSelected({
                        id: id
                    });
                    if (swcProfileSelectorViewStateSrvc.selectedPhenomenon) this.phenomenonSelected(swcProfileSelectorViewStateSrvc.selectedPhenomenon);
                };

                var initProcedure = (id) => {
                    id = parseInt(id);
                    if (Number.isInteger(id)) this.procedureSelected({
                        id: id
                    });
                    if (swcProfileSelectorViewStateSrvc.selectedProcedure) this.procedureSelected(swcProfileSelectorViewStateSrvc.selectedProcedure);
                };

                var setSelectedProvider = (provider) => this.selectedProvider = swcProfileSelectorViewStateSrvc.selectedProvider = provider;
                var setSelectedOffering = (offering) => this.selectedOffering = swcProfileSelectorViewStateSrvc.selectedOffering = offering;
                var setSelectedPhenomenon = (phenomenon) => this.selectedPhenomenon = swcProfileSelectorViewStateSrvc.selectedPhenomenon = phenomenon;
                var setSelectedProcedure = (procedure) => this.selectedProcedure = swcProfileSelectorViewStateSrvc.selectedProcedure = procedure;

                this.$onInit = () => {
                    initProvider($location.search().url);
                    initOffering($location.search().offering);
                    initPhenomenon($location.search().phenomenon);
                    initProcedure($location.search().procedure);
                    $location.params;
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
    .service('swcProfileSelectorViewStateSrvc', [
        function() {}
    ]);
