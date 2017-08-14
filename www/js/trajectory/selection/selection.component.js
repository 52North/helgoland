angular.module('n52.core.trajectory')
    .component('swcTrajectorySelectorView', {
        bindings: {
            datasets: '<',
            data: '<'
        },
        template: require('./selection.component.html'),
        controller: ['settingsService', 'constants', 'combinedSrvc', '$state',
            function(settingsService, constants, combinedSrvc, $state) {

                this.platformParams = [{
                    type: 'platform',
                    header: 'Mobile Platform'
                }, {
                    type: 'offering',
                    header: 'Offering'
                }, {
                    type: 'feature',
                    header: 'Pfad'
                }, {
                    type: 'phenomenon',
                    header: 'Phänomen'
                }, {
                    type: 'dataset',
                    header: 'Dataset'
                }];

                this.phenomenonParams = [{
                    type: 'phenomenon',
                    header: 'Phänomen'
                }, {
                    type: 'offering',
                    header: 'Offering'
                }, {
                    type: 'feature',
                    header: 'Pfad'
                }, {
                    type: 'dataset',
                    header: 'Dataset'
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
                    this.paramFilter = createFilter();
                };

                this.providerSelected = (provider) => {
                    this.tabActive = 1;
                    this.selectedProvider = [{
                        serviceID: provider.id,
                        url: provider.providerUrl
                    }];
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
