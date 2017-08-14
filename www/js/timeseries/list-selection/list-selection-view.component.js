angular.module('n52.core.timeseries')
    .component('swcTimeseriesListSelectionView', {
        template: require('./list-selection-view.component.html'),
        controller: ['providerSelection', 'seriesApiInterface', 'timeseriesService', '$state',
            function(providerSelection, seriesApiInterface, timeseriesService, $state) {

                this.categoryParams = [{
                    type: 'category',
                    header: 'Kategorie'
                }, {
                    type: 'feature',
                    header: 'Station'
                }, {
                    type: 'phenomenon',
                    header: 'Phänomen'
                }, {
                    type: 'procedure',
                    header: 'Sensor'
                }];

                this.stationParams = [{
                    type: 'feature',
                    header: 'Station'
                }, {
                    type: 'category',
                    header: 'Kategorie'
                }, {
                    type: 'phenomenon',
                    header: 'Phänomen'
                }, {
                    type: 'procedure',
                    header: 'Sensor'
                }];

                this.phenomenonParams = [{
                    type: 'phenomenon',
                    header: 'Phänomen'
                }, {
                    type: 'category',
                    header: 'Kategorie'
                }, {
                    type: 'feature',
                    header: 'Station'
                }, {
                    type: 'procedure',
                    header: 'Sensor'
                }];

                this.procedureParams = [{
                    type: 'procedure',
                    header: 'Sensor'
                }, {
                    type: 'feature',
                    header: 'Station'
                }, {
                    type: 'phenomenon',
                    header: 'Phänomen'
                }, {
                    type: 'category',
                    header: 'Kategorie'
                }];

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
                            timeseriesService.addTimeseries(result);
                            $state.go('timeseries.diagram');
                        });
                    } else {
                        timeseriesService.addTimeseriesById(dataset[0].id, url);
                        $state.go('timeseries.diagram');
                    }
                };
            }
        ]
    });
