angular.module('n52.core.profile')
    .component('swcProfileCombiLink', {
        bindings: {
            profile: '<'
        },
        template: require('./combi-link.component.html'),
        controller: ['$state',
            function($state) {
                this.goToCombiView = () => {
                    $state.go('profiles.combi', {
                        url: this.profile.url,
                        id: this.profile.id,
                        time: this.profile.selectedTime
                    });
                };
            }
        ]
    });
