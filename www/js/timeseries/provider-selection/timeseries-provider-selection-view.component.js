import 'n52-sensorweb-client-core/src/js/selection/provider-selector/component';

angular.module('n52.core.timeseries')
    .component('swcProviderSelectionView', {
        template: require('../../../templates/timeseries/timeseries-provider-selection-view.html'),
        controller: ['settingsService', 'providerSelection', '$location',
            function(settingsService, providerSelection, $location) {

                this.selectedProvider = providerSelection.selectedProvider;

                var createFilter = () => {
                    var filter = {
                        valueTypes: 'quantity'
                    };
                    return filter;
                };

                this.$onInit = () => {
                    this.providerList = settingsService.restApiUrls;
                    this.providerBlacklist = settingsService.providerBlackList;
                    this.providerFilter = createFilter();
                };

                this.providerSelected = (provider) => {
                    providerSelection.selectProvider(provider);
                    $location.url('/timeseries/map-selection');
                };
            }
        ]
    })
    .service('providerSelection', ['statusService',
        function(statusService) {
            var timeseriesProviderStatusParameter = 'timeseriesProvider';

            this.selectedProvider = statusService.status[timeseriesProviderStatusParameter];

            this.selectProvider = (provider) => {
                this.selectedProvider = provider;
                statusService.status[timeseriesProviderStatusParameter] = provider;
            };
        }
    ]);
