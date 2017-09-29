import 'n52-sensorweb-client-core/src/js/selection/provider-selector/component';
import 'n52-sensorweb-client-core/src/js/selection/multi-service-filter-selector/component';

angular.module('n52.core.trajectory')
    .component('swcMultiPhenomenonButton', {
        bindings: {
            dataset: '<',
            feature: '<',
            selectedPhenomena: '<',
            selectedPhenomenaChanged: "&onSelectedPhenomenaChanged",
        },
        template: require('./multi-phenomenon-selection.component.html'),
        controller: ['seriesApiInterface', 'colorService',
            function(seriesApiInterface, colorService) {

                this.$onChanges = (changes) => {
                    if (changes.feature && this.feature) {
                        seriesApiInterface.getPhenomena(null, this.dataset.providerUrl, {
                            platformTypes: 'mobile',
                            features: this.feature.id
                        }).then(result => {
                            this.visible = result.length > 1;
                            this.phenomenaList = result.filter((entry) => {
                                entry.color = colorService.getColor(entry.id);
                                if (this.dataset.parameters && entry.id !== this.dataset.parameters.phenomenon.id ||
                                    this.dataset.seriesParameters && entry.id !== this.dataset.seriesParameters.phenomenon.id) {
                                    return true;
                                }
                            });
                        });
                    }
                };

                this.toggleSelection = (entry) => {
                    entry.selected = !entry.selected;
                    this.selectedPhenomenaChanged({
                        phenomenaList: this.phenomenaList
                    });
                };

            }
        ]
    });
