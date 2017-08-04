require('n52-sensorweb-client-core/src/js/permalink/simple-permalink-button/component');
require('n52-sensorweb-client-core/src/js/permalink/permalink-in-mail/component');
require('n52-sensorweb-client-core/src/js/permalink/permalink-new-window/component');
require('n52-sensorweb-client-core/src/js/permalink/permalink-to-clipboard/component');
require('n52-sensorweb-client-core/src/js/permalink/service/permalink-service');

angular.module('n52.core.trajectory')
    .component('swcTrajectoryView', {
        bindings: {
            datasets: '<',
            data: '<'
        },
        template: require('./view.component.html'),
        controller: ['trajectoryViewPermalinkSrvc',
            function(trajectoryViewPermalinkSrvc) {
                this.$onInit = () => {
                    trajectoryViewPermalinkSrvc.validatePermalink();
                };

                this.createPermalink = () => {
                    return trajectoryViewPermalinkSrvc.createPermalink();
                };
            }
        ]
    })
    .service('trajectoryViewPermalinkSrvc', ['$location', 'permalinkService', 'combinedSrvc',
        function($location, permalinkService, combinedSrvc) {
            var trajectoryIdParam = 'id';
            var trajectoryUrlParam = 'url';

            this.createPermalink = () => {
                if (combinedSrvc.series.id && combinedSrvc.series.providerUrl) {
                    return permalinkService.createBaseUrl() + '?' +
                        trajectoryIdParam + '=' + combinedSrvc.series.id + '&' +
                        trajectoryUrlParam + '=' + combinedSrvc.series.providerUrl;
                }
                return permalinkService.createBaseUrl();
            };

            this.validatePermalink = () => {
                var params = $location.search();
                if (params[trajectoryIdParam] && params[trajectoryUrlParam]) {
                    combinedSrvc.loadSeries(params[trajectoryIdParam], params[trajectoryUrlParam]);
                }
            };
        }
    ]);
