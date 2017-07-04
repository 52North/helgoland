angular.module('n52.core.timeseries', [])
    .config(['$stateProvider',
        function($stateProvider) {

            var openProviderSelection = (trans) => {
                if (!trans.injector().get('providerSelection').selectedProvider) {
                    return 'timeseries.provider';
                }
            };

            // default state
            $stateProvider.state('timeseries', {
                label: 'navigation.timeseries.header',
                url: '/timeseries',
                template: require('../../templates/timeseries/timeseries-menu.html')
            });
            $stateProvider.state('timeseries.diagram', {
                url: '/diagram',
                component: 'swcTimeseriesDiagramView'
            });
            $stateProvider.state('timeseries.provider', {
                url: '/provider',
                component: 'swcProviderSelectionView'
            });
            $stateProvider.state('timeseries.list-selection', {
                url: '/list-selection',
                redirectTo: (trans) => openProviderSelection(trans),
                component: 'swcTimeseriesListSelectionView'
            });
            $stateProvider.state('timeseries.map-selection', {
                url: '/map-selection',
                redirectTo: (trans) => openProviderSelection(trans),
                component: 'swcTimeseriesMapSelectionView'
            });
        }
    ]);
