import 'n52-sensorweb-client-core/src/js/selection/provider-selector/component';
import 'n52-sensorweb-client-core/src/js/selection/platform-map-selector/component';
import 'n52-sensorweb-client-core/src/js/selection/trajectory-map-selector/component';
import 'n52-sensorweb-client-core/src/js/selection/time-list-selector/component';

angular.module('n52.core.profile')
    .component('swcProfileSelectorView', {
        template: require('../../../templates/profile/profile-selection-view.html'),
        controller: ['settingsService', 'profileSelectorPermalinkSrvc', '$uibModal', 'swcProfileSelectorViewStateSrvc', '$state',
            function(settingsService, profileSelectorPermalinkSrvc, $uibModal, swcProfileSelectorViewStateSrvc, $state) {

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
                    if (this.selectedFeature) filter.feature = this.selectedFeature.id;
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

                var setSelectedFeature = (feature) => {
                    this.selectedFeature = swcProfileSelectorViewStateSrvc.selectedFeature = feature;
                };

                this.$onInit = () => {
                    profileSelectorPermalinkSrvc.validatePermalink().then(() => {
                        if (swcProfileSelectorViewStateSrvc.selectedProvider) this.providerSelected(swcProfileSelectorViewStateSrvc.selectedProvider);
                        if (swcProfileSelectorViewStateSrvc.selectedOffering) this.offeringSelected(swcProfileSelectorViewStateSrvc.selectedOffering);
                        if (swcProfileSelectorViewStateSrvc.selectedPhenomenon) this.phenomenonSelected(swcProfileSelectorViewStateSrvc.selectedPhenomenon);
                        if (swcProfileSelectorViewStateSrvc.selectedProcedure) this.procedureSelected(swcProfileSelectorViewStateSrvc.selectedProcedure);
                        if (swcProfileSelectorViewStateSrvc.selectedFeature) this.featureSelected(swcProfileSelectorViewStateSrvc.selectedFeature);
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
                        setSelectedFeature(null);
                    }
                    setSelectedProvider(provider);
                    this.offeringFilter = createFilter();
                };

                this.offeringSelected = (offering, clearPrevious) => {
                    this.tabActive = 2;
                    if (clearPrevious) {
                        setSelectedPhenomenon(null);
                        setSelectedProcedure(null);
                        setSelectedFeature(null);
                    }
                    setSelectedOffering(offering);
                    this.phenomenonFilter = createFilter();
                };

                this.phenomenonSelected = (phenomenon, clearPrevious) => {
                    this.tabActive = 3;
                    if (clearPrevious) {
                        setSelectedProcedure(null);
                        setSelectedFeature(null);
                    }
                    setSelectedPhenomenon(phenomenon);
                    this.procedureFilter = createFilter();
                };

                this.procedureSelected = (procedure, clearPrevious) => {
                    this.tabActive = 4;
                    if (clearPrevious) {
                        setSelectedFeature(null);
                    }
                    setSelectedProcedure(procedure);
                    this.stationaryPlatformFilter = createFilter();
                    this.mobilePlatformFilter = createFilter();
                    this.stationaryPlatformFilter.platformTypes = 'stationary';
                    this.mobilePlatformFilter.platformTypes = 'mobile';
                };

                this.featureSelected = (feature) => {
                    this.tabActive = 5;
                    setSelectedFeature(feature);
                    this.trajectoryFilter = createFilter();
                };

                this.platformSelected = (platform) => {
                    this.selectedPlatform = platform;
                    $uibModal.open({
                        animation: true,
                        template: require('../../../templates/profile/profile-stationary-selection.html'),
                        resolve: {
                            selection: () => {
                                return {
                                    platform: platform,
                                    url: this.selectedProvider.providerUrl
                                };
                            }
                        },
                        controller: ['$scope', 'selection', '$uibModalInstance', 'seriesApiInterface', 'profilesService',
                            function($scope, selection, $uibModalInstance, seriesApiInterface, profilesService) {
                                $scope.platform = selection.platform;

                                $scope.platform.datasets.forEach(dataset => {
                                    dataset.loading = true;
                                    seriesApiInterface.getDatasets(dataset.id, selection.url)
                                        .then(res => {
                                            dataset.url = selection.url;
                                            var timespan = {
                                                start: res.firstValue.timestamp,
                                                end: res.lastValue.timestamp
                                            };
                                            seriesApiInterface.getDatasetData(dataset.id, selection.url, timespan)
                                                .then(data => {
                                                    dataset.dataTimestamps = [];
                                                    data.values.forEach(entry => {
                                                        dataset.dataTimestamps.push(entry.timestamp);
                                                    });
                                                    dataset.loading = false;
                                                });
                                        });
                                });

                                $scope.onTimeselected = (dataset, time) => {
                                    profilesService.addProfile(dataset.id, selection.url, time);
                                    $state.go('profiles.view');
                                };

                                $scope.close = () => {
                                    $uibModalInstance.close();
                                };
                            }
                        ]
                    });
                };

                this.mobileMarkerSelected = (dataset, selectedGeometry) => {
                    $uibModal.open({
                        animation: true,
                        template: require('../../../templates/profile/profile-trajectory-preview.html'),
                        resolve: {
                            selection: () => {
                                return {
                                    dataset: dataset,
                                    url: this.selectedProvider.providerUrl,
                                    geometry: selectedGeometry
                                };
                            }
                        },
                        controller: ['$scope', 'selection', '$uibModalInstance', 'profilesService',
                            function($scope, selection, $uibModalInstance, profilesService) {
                                $scope.dataset = selection.dataset;
                                $scope.geometry = selection.geometry;

                                selection.dataset.style = {
                                    color: 'red'
                                };

                                $scope.datasets = {
                                    'preview': selection.dataset
                                };

                                $scope.data = {
                                    'preview': [{
                                        value: selection.geometry.value,
                                        verticalUnit: selection.geometry.verticalUnit
                                    }]
                                };

                                $scope.addToChart = () => {
                                    profilesService.addProfile(dataset.id, selection.url, selection.geometry.timestamp);
                                    $state.go('profiles.view');
                                    $scope.close();
                                };

                                $scope.close = () => {
                                    $uibModalInstance.close();
                                };
                            }
                        ]
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
    .service('profileSelectorPermalinkSrvc', ['$location', 'seriesApiInterface', 'swcProfileSelectorViewStateSrvc', '$q', '$state',
        function($location, seriesApiInterface, swcProfileSelectorViewStateSrvc, $q, $state) {
            var providerUrlParam = 'url';
            var providerIdParam = 'id';
            var offeringParam = 'offering';
            var phenomenonParam = 'phenomenon';
            var procedureParam = 'procedure';
            var featureParam = 'feature';
            this.createPermalink = () => {
                var parameter = '';
                var location = $state.href('profiles.selection', null, {
                    absolute: true
                });
                if (swcProfileSelectorViewStateSrvc.selectedProvider) {
                    parameter += providerUrlParam + '=' + swcProfileSelectorViewStateSrvc.selectedProvider.providerUrl;
                    parameter += '&' + providerIdParam + '=' + swcProfileSelectorViewStateSrvc.selectedProvider.id;
                    if (swcProfileSelectorViewStateSrvc.selectedOffering) {
                        parameter += '&' + offeringParam + '=' + swcProfileSelectorViewStateSrvc.selectedOffering.id;
                        if (swcProfileSelectorViewStateSrvc.selectedPhenomenon) {
                            parameter += '&' + phenomenonParam + '=' + swcProfileSelectorViewStateSrvc.selectedPhenomenon.id;
                            if (swcProfileSelectorViewStateSrvc.selectedProcedure) {
                                parameter += '&' + procedureParam + '=' + swcProfileSelectorViewStateSrvc.selectedProcedure.id;
                                if (swcProfileSelectorViewStateSrvc.selectedFeature) {
                                    parameter += '&' + featureParam + '=' + swcProfileSelectorViewStateSrvc.selectedFeature.id;
                                }
                            }
                        }
                    }
                }
                if (parameter) {
                    return location + '?' + parameter;
                } else {
                    return location;
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
                                                                    if ($location.search()[featureParam]) {
                                                                        seriesApiInterface.getFeatures($location.search()[featureParam], url)
                                                                            .then(feature => {
                                                                                swcProfileSelectorViewStateSrvc.selectedFeature = feature;
                                                                                resolve();
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
