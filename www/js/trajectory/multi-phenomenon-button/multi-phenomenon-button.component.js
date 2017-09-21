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
        template: require('./multi-phenomenon-button.component.html'),
        controller: ['seriesApiInterface', '$uibModal',
            function(seriesApiInterface, $uibModal) {

                var notify = (result) => {
                    this.selectedPhenomenaChanged({
                        phenomenaList: result
                    });
                };

                this.$onChanges = (changes) => {
                    if (changes.feature && this.feature) {
                        seriesApiInterface.getPhenomena(null, this.dataset.providerUrl, {
                            platformTypes: 'mobile',
                            features: this.feature.id
                        }).then(result => {
                            this.visible = result.length > 1;
                            this.phenomenaList = result.filter((entry) => {
                                if (entry.id !== this.dataset.seriesParameters.phenomenon.id) {
                                    return true;
                                }
                            });
                        });
                    }
                };

                this.openSelection = () => {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        template: require('./multi-phenomenon-modal.component.html'),
                        resolve: {
                            phenomenaList: () => {
                                return this.phenomenaList.map(entry => {
                                    if (this.selectedPhenomena && this.selectedPhenomena.indexOf(entry.id) > -1) {
                                        entry.selected = true;
                                    }
                                    return entry;
                                });
                            }
                        },
                        controller: ['$scope', '$uibModalInstance', 'phenomenaList',
                            function($scope, $uibModalInstance, phenomenaList) {

                                $scope.phenomenaList = phenomenaList;

                                $scope.toggleSelection = function(entry) {
                                    entry.selected = !entry.selected;
                                };

                                $scope.submitSelection = function() {
                                    $uibModalInstance.close(this.phenomenaList);
                                };

                                $scope.close = function() {
                                    $uibModalInstance.close();
                                };
                            }
                        ]
                    });

                    modalInstance.result.then(notify);
                };
            }
        ]
    });
