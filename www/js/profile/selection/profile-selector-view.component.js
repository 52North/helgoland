angular.module('n52.core.profile')
    .component('swcProfileSelectorView', {
        bindings: {
            series: '<'
        },
        template: require('../../../templates/profile/profileSelection.html'),
        controller: ['providerService', 'settingsService', '$uiRouterGlobals', '$location', '$uibModal',
            function(providerService, settingsService, $uiRouterGlobals, $location, $uibModal) {
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
                };

                var initOffering = (id) => {
                    id = parseInt(id);
                    if (Number.isInteger(id)) this.offeringSelected({
                        id: id
                    });
                };

                var initPhenomenon = (id) => {
                    id = parseInt(id);
                    if (Number.isInteger(id)) this.phenomenonSelected({
                        id: id
                    });
                };

                var initProcedure = (id) => {
                    id = parseInt(id);
                    if (Number.isInteger(id)) this.procedureSelected({
                        id: id
                    });
                };

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

                this.providerSelected = (provider) => {
                    this.tabActive = 1;
                    this.selectedOffering = null;
                    this.selectedPhenomenon = null;
                    this.selectedProcedure = null;
                    this.selectedProvider = provider;
                    this.offeringFilter = createFilter();
                };

                this.offeringSelected = (offering) => {
                    this.tabActive = 2;
                    this.selectedPhenomenon = null;
                    this.selectedProcedure = null;
                    this.selectedOffering = offering;
                    this.phenomenonFilter = createFilter();
                };

                this.phenomenonSelected = (phenomenon) => {
                    this.tabActive = 3;
                    this.selectedProcedure = null;
                    this.selectedPhenomenon = phenomenon;
                    this.procedureFilter = createFilter();
                };

                this.procedureSelected = (procedure) => {
                    this.tabActive = 4;
                    this.selectedProcedure = procedure;
                    this.platformFilter = createFilter();
                };

                this.platformSelected = (platform) => {
                    this.selectedPlatform = platform;
                    $uibModal.open({
                        animation: true,
                        templateUrl: 'n52.core.map.stationary-insitu',
                        resolve: {
                            selection: () => {
                                var url = this.selectedProvider.providerUrl;
                                return {
                                    stationId: platform.id,
                                    phenomenonId: this.selectedPhenomenon,
                                    url: url
                                };
                            }
                        },
                        controller: 'SwcModalStationaryInsituCtrl'
                    });
                };
            }
        ]
    });
