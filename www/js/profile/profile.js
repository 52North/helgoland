angular.module('n52.core.profile', [])
    .config(['$stateProvider',
        function($stateProvider) {
            // default state
            $stateProvider.state('profiles', {
                label: 'navigation.profile',
                url: '/profiles',
                redirectTo: function(trans) {
                    return trans.injector().get('profilesService').hasProfiles() ? 'profiles.view' : 'profiles.selection';
                },
                template: require('../../templates/profile/profile-menu.html')
            });
            $stateProvider.state('profiles.view', {
                url: '/view',
                component: 'swcProfileChartView'
            });
            $stateProvider.state('profiles.selection', {
                url: '/selection',
                component: 'swcProfileSelectorView'
            });
        }
    ]);
