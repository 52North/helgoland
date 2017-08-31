angular.module('n52.core.trajectory')
    .component('swcTrajectorySelectorView', {
        bindings: {
            datasets: '<',
            data: '<'
        },
        template: require('./selection.component.html'),
        controller: [
            function() { }
        ]
    });
