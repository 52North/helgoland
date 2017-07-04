angular.module('n52.core.timeseries')
    .component('swcTimeseriesListSelectionView', {
        template: require('../../../templates/timeseries/timeseries-list-selection-view.html'),
        controller: ['providerSelection', 'seriesApiInterface', 'timeseriesService', '$state',
            function(providerSelection, seriesApiInterface, timeseriesService, $state) {
                this.$onInit = () => {
                    if (providerSelection.selectedProvider) {
                        this.providerList = [{
                            url: providerSelection.selectedProvider.providerUrl,
                            serviceID: providerSelection.selectedProvider.id
                        }];
                    }
                };

                this.datasetSelected = (dataset, url) => {
                    if (dataset[0].datasetType || dataset[0].valueType) {
                        seriesApiInterface.getDatasets(dataset[0].id, url).then(result => {
                            result.apiUrl = url;
                            timeseriesService.addTimeseries(dataset[0]);
                            $state.go('timeseries.diagram');
                        });
                    } else {
                        timeseriesService.addTimeseries(dataset[0]);
                        $state.go('timeseries.diagram');
                    }
                };
            }
        ]
    });
