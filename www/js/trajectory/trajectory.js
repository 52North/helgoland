angular.module('n52.core.trajectory', [])
    .config(['$stateProvider',
        function($stateProvider) {
            // default state
            $stateProvider.state('trajectory', {
                label: 'navigation.trajectory',
                url: '/trajectory',
                // TODO check if trajectory is selected
                // redirectTo: function(trans) {
                //     return trans.injector().get('profilesService').hasProfiles() ? 'profiles.diagram' : 'profiles.selection';
                // },
                template: require('../../templates/trajectory/trajectory-submenu.html')
            });
            $stateProvider.state('trajectory.view', {
                url: '/view',
                component: 'swcTrajectoryView'
            });
            $stateProvider.state('trajectory.selection', {
                url: '/selection',
                component: 'swcTrajectorySelectorView'
            });
        }
    ]);
