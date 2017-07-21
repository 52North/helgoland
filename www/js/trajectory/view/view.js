angular.module('n52.core.trajectory')
    .component('swcTrajectoryView', {
        bindings: {
            datasets: '<',
            data: '<'
        },
        template: require('../../../templates/trajectory/trajectory-view.html'),
        controller: [
            function() {

            }
        ]
    });
