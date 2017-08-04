angular.module('n52.core.profile')
    .component('swcProfileLegend', {
        bindings: {
            profiles: '<'
        },
        template: require('./legend.component.html'),
        controller: ['profilesService',
            function(profilesService) {
                this.$onInit = function() {
                    this.profileList = profilesService.profiles;
                    this.profileData = profilesService.profileData;
                };
            }
        ]
    });
