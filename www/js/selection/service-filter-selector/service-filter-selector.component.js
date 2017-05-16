angular.module('n52.core.profile')
    .component('serviceFilterSelector', {
        bindings: {
            endpoint: '<',
            serviceUrl: '<',
            filter: '<',
            itemSelected: "&onItemSelected",
        },
        templateUrl: 'n52.core.selection.service-filter-selector',
        controller: ['seriesApiInterface',
            function(seriesApiInterface) {
                this.items = [];

                this.$onChanges = () => {
                    switch (this.endpoint) {
                        case 'offering':
                            seriesApiInterface.getOfferings(null, this.serviceUrl, this.filter)
                                .then(res => this.items = res);
                            break;
                        case 'phenomenon':
                            seriesApiInterface.getPhenomena(null, this.serviceUrl, this.filter)
                                .then(res => this.items = res);
                            break;
                        case 'procedure':
                            seriesApiInterface.getProcedures(null, this.serviceUrl, this.filter)
                                .then(res => this.items = res);
                            break;
                        case 'categories':
                            seriesApiInterface.getCategories(null, this.serviceUrl, this.filter)
                                .then(res => this.items = res);
                            break;
                        default:
                    }
                };

                this.selectItem = (item) => {
                    this.itemSelected({
                        item: item
                    });
                };
            }
        ]
    });
