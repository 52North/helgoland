angular.module('n52.core.profile', [])
.config(['$stateProvider',
    function($stateProvider) {
        // default state
        $stateProvider.state('profiles', {
            label: 'navigation.profile',
            url: '/profiles',
            redirectTo: 'profiles.view',
            template: require('../../templates/profile/profileMenu.html')
        });
        $stateProvider.state('profiles.view', {
            url: '/view',
            template: require('../../templates/profile/profileView.html')
        });
        $stateProvider.state('profiles.selection', {
            url: '/selection',
            template: require('../../templates/profile/profileSelection.html')
        });
    }
]);
