require('n52-sensorweb-client-core/src/js/Legend/geometry-map-viewer/component');

angular.module('n52.core.profile')
    .component('swcProfileLegendEntry', {
        bindings: {
            profile: '<',
            data: '<'
        },
        template: require('./legend-entry.component.html'),
        controller: ['profilesService', 'constants', 'seriesApiInterface', '$uibModal',
            function(profilesService, constants, seriesApiInterface, $uibModal) {
                this.$onInit = function() {
                    this.isSelectionToggled = profilesService.isProfileSelectionToggled(this.profile.internalId);
                    this.isToggled = profilesService.isProfileToggled(this.profile.internalId);
                };

                this.toggleSelection = function(profile) {
                    profilesService.toggleProfileSelection(profile.internalId);
                    this.isSelectionToggled = profilesService.isProfileSelectionToggled(profile.internalId);
                };

                this.toggleProfile = function(profile) {
                    profilesService.toggleProfile(profile.internalId);
                    this.isToggled = profilesService.isProfileToggled(profile.internalId);
                };

                this.showGeometry = function() {
                    if (this.profile.platformType === constants.platformType.stationaryInsitu) {
                        var platformId;
                        if (this.profile && this.profile.seriesParameters) platformId = this.profile.seriesParameters.platform.id;
                        if (this.profile && this.profile.datasetParameters) platformId = this.profile.datasetParameters.platform.id;
                        seriesApiInterface.getPlatforms(platformId, this.profile.url)
                            .then(res => {
                                openGeometryView(this.profile, res.geometry);
                            });
                    } else {
                        openGeometryView(this.profile, this.data[0].geometry);
                    }
                };

                var openGeometryView = (profile, geometry) => {
                    $uibModal.open({
                        animation: true,
                        template: require('../../../templates/legend/location-modal.html'),
                        resolve: {
                            data: () => {
                                return {
                                    profile: profile,
                                    geometry: geometry
                                };
                            }
                        },
                        controller: ['$scope', 'data', '$uibModalInstance',
                            function($scope, data, $uibModalInstance) {
                                var platformLabel;
                                if (data.profile && data.profile.seriesParameters) platformLabel = data.profile.seriesParameters.platform.label;
                                if (data.profile && data.profile.datasetParameters) platformLabel = data.profile.datasetParameters.platform.label;
                                $scope.header = platformLabel;
                                $scope.geometry = data.geometry;

                                $scope.close = () => {
                                    $uibModalInstance.close();
                                };
                            }
                        ]
                    });
                };

                this.removeProfile = function(profile) {
                    profilesService.removeProfile(profile.internalId);
                };

                this.$doCheck = function() {};
            }
        ]
    });
