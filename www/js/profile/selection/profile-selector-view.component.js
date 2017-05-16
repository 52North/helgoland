angular.module('n52.core.profile')
    .component('swcProfileSelectorView', {
        bindings: {
            series: '<'
        },
        template: require('../../../templates/profile/profileSelection.html'),
        controller: ['providerService', 'settingsService', '$uiRouterGlobals', '$location', '$uibModal',
            function(providerService, settingsService, $uiRouterGlobals, $location, $uibModal) {
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
                    if (this.selectedOffering) filter.offering = this.selectedOffering;
                    if (this.selectedPhenomenon) filter.phenomenon = this.selectedPhenomenon;
                    if (this.selectedProcedure) {
                        filter.procedure = this.selectedProcedure;
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
                    this.selectedPlatform({id: 'stationary_insitu_146'});
                };

                this.providerSelected = (provider) => {
                    this.selectedOffering = null;
                    this.selectedPhenomenon = null;
                    this.selectedProcedure = null;
                    this.selectedProviderUrl = provider.providerUrl;
                    this.offeringFilter = createFilter();
                };

                this.offeringSelected = (offering) => {
                    this.selectedPhenomenon = null;
                    this.selectedProcedure = null;
                    this.selectedOffering = offering.id;
                    this.phenomenonFilter = createFilter();
                };

                this.phenomenonSelected = (phenomenon) => {
                    this.selectedProcedure = null;
                    this.selectedPhenomenon = phenomenon.id;
                    this.procedureFilter = createFilter();
                };

                this.procedureSelected = (procedure) => {
                    this.selectedProcedure = procedure.id;
                    this.platformFilter = createFilter();
                };

                this.platformSelected = (platform) => {
                    this.selectedPlatform = platform;
                    $uibModal.open({
                        animation: true,
                        templateUrl: 'n52.core.map.stationary-insitu',
                        resolve: {
                            selection: () => {
                                var url = this.selectedProviderUrl;
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
