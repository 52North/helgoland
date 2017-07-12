angular.module('n52.client.navigation')
    .component('swcContactModal', {
        template: require('../templates/menu/contact.html'),
        controller: ['$uibModal',
            function($uibModal) {
                // this.openContacts = () => {
                    $uibModal.open({
                        animation: true,
                        template: require('../templates/menu/contact-window.html'),
                        controller: ['$scope', '$uibModalInstance',
                            function ($scope, $uibModalInstance) {
                                $scope.close = () => {
                                    $uibModalInstance.close();
                                };
                            }]
                    });
                // };
            }
        ]
    });
