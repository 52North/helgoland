angular.module('n52.core.trajectory', [])
    .config(['$stateProvider',
        function($stateProvider) {
            // default state
            $stateProvider.state('trajectory', {
                label: 'navigation.trajectory',
                url: '/trajectory',
                redirectTo: function(trans) {
                    return trans.injector().get('combinedSrvc').series.id ? 'trajectory.view' : 'trajectory.selection';
                },
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
