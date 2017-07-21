import 'n52-sensorweb-client-core/src/js/selection/provider-selector/component';
import 'n52-sensorweb-client-core/src/js/selection/multi-service-filter-selector/component';

angular.module('n52.core.trajectory')
    .component('swcTrajectorySelectorView', {
        bindings: {
            datasets: '<',
            data: '<'
        },
        template: require('../../../templates/trajectory/trajectory-selection.html'),
        controller: ['settingsService', 'constants', 'combinedSrvc', '$state',
            function(settingsService, constants, combinedSrvc, $state) {

                this.platformParams = [{
                    type: 'platform',
                    header: 'trajectories.headers.platform'
                }, {
                    type: 'offering',
                    header: 'trajectories.headers.offering'
                }, {
                    type: 'feature',
                    header: 'trajectories.headers.track'
                }, {
                    type: 'phenomenon',
                    header: 'trajectories.headers.phenomenon'
                }, {
                    type: 'dataset',
                    header: 'trajectories.headers.dataset'
                }];

                this.phenomenonParams = [{
                    type: 'phenomenon',
                    header: 'trajectories.headers.phenomenon'
                }, {
                    type: 'offering',
                    header: 'trajectories.headers.offering'
                }, {
                    type: 'feature',
                    header: 'trajectories.headers.track'
                }, {
                    type: 'dataset',
                    header: 'trajectories.headers.dataset'
                }];

                var createFilter = () => {
                    var filter = {
                        valueTypes: constants.valueType.quantity,
                        platformTypes: constants.platformType.mobileInsitu
                    };
                    return filter;
                };

                this.$onInit = () => {
                    this.providerList = settingsService.restApiUrls;
                    this.providerBlacklist = settingsService.providerBlackList;
                    this.providerFilter = createFilter();
                };

                this.providerSelected = (provider) => {
                    this.tabActive = 1;
                    this.selectedProvider = provider;
                };

                this.datasetSelected = (dataset, url) => {
                    if (dataset instanceof Array && dataset.length === 1) {
                        combinedSrvc.loadSeries(dataset[0].id, url);
                        $state.go('trajectory.view');
                    }
                };
            }
        ]
    });
