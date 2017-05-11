angular.module('n52.core.profile')
    .component('swcProfileLegend', {
        bindings: {
            series: '<'
        },
        template: require('../../../templates/profile/profile-legend.html'),
        controller: ['profilesService',
            function(profilesService) {
                this.$onInit = function() {
                    this.seriesList = profilesService.profiles;
                    this.seriesData = profilesService.profileData;
                };
            }
        ]
    })
    .component('swcProfileLegendEntry', {
        bindings: {
            series: '<',
            data: '<'
        },
        template: require('../../../templates/profile/profile-legend-entry.html'),
        controller: ['profilesService',
            function(profilesService) {
                this.$onInit = function() {
                    this.isSelectionToggled = profilesService.isProfileSelectionToggled(this.series.internalId);
                    this.isToggled = profilesService.isProfileToggled(this.series.internalId);
                };

                this.toggleSelection = function(series) {
                    profilesService.toggleProfileSelection(series.internalId);
                    this.isSelectionToggled = profilesService.isProfileSelectionToggled(series.internalId);
                };

                this.toggleProfile = function(series) {
                    profilesService.toggleProfile(series.internalId);
                    this.isToggled = profilesService.isProfileToggled(series.internalId);
                };

                this.removeProfile = function(series) {
                    profilesService.removeProfile(series.internalId);
                };

                this.$doCheck = function() {
                };
            }
        ]
    });
