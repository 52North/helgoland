import {Component} from '@angular/core';

@Component({
    selector: 'multi-service-filter-selector',
    template: `
    <h2>First Test!</h2>
  `
})
export class MultiServiceFilterSelectorComponent {

}

// require('../selection');
// angular.module('n52.core.selection')
//     .component('multiServiceFilterSelector', {
//         bindings: {
//             endpoint: '<',
//             filterList: '<',
//             itemSelected: "&onItemSelected",
//         },
//         templateUrl: 'n52.core.selection.multi-service-filter-selector',
//         controller: ['seriesApiInterface',
//             function(seriesApiInterface) {
//                 this.items = [];
//                 this.loading = 0;
//
//                 var setItems = (res, prevfilter, url, serviceID) => {
//                     this.loading--;
//                     res.forEach(entry => {
//                         var filter = {
//                             filter : prevfilter,
//                             url : url,
//                             itemId : entry.id,
//                             serviceID : serviceID
//                         };
//                         var item = this.items.find((elem) => {
//                             if (elem.label === entry.label) return true;
//                         });
//                         if (item) {
//                             item.filterList.push(filter);
//                         } else {
//                             entry.filterList = [filter];
//                             this.items.push(entry);
//                         }
//                     });
//                 };
//
//                 this.$onChanges = () => {
//                     this.items = [];
//                     this.filterList.forEach(entry => {
//                         this.loading++;
//                         var filter = entry.filter || {};
//                         filter.service = entry.serviceID;
//                         switch (this.endpoint) {
//                             case 'offering':
//                                 seriesApiInterface.getOfferings(null, entry.url, filter)
//                                     .then(
//                                         res => setItems(res, filter, entry.url, entry.serviceID),
//                                         () => this.loading--
//                                     );
//                                 break;
//                             case 'phenomenon':
//                                 seriesApiInterface.getPhenomena(null, entry.url, filter)
//                                     .then(
//                                         res => setItems(res, filter, entry.url, entry.serviceID),
//                                         () => this.loading--
//                                     );
//                                 break;
//                             case 'procedure':
//                                 seriesApiInterface.getProcedures(null, entry.url, filter)
//                                     .then(
//                                         res => setItems(res, filter, entry.url, entry.serviceID),
//                                         () => this.loading--
//                                     );
//                                 break;
//                             case 'feature':
//                                 seriesApiInterface.getFeatures(null, entry.url, filter)
//                                     .then(
//                                         res => setItems(res, filter, entry.url, entry.serviceID),
//                                         () => this.loading--
//                                     );
//                                 break;
//                             case 'category':
//                                 seriesApiInterface.getCategories(null, entry.url, filter)
//                                     .then(
//                                         res => setItems(res, filter, entry.url, entry.serviceID),
//                                         () => this.loading--
//                                     );
//                                 break;
//                             default:
//                                 console.error('Wrong endpoint: ' + this.endpoint);
//                                 this.loading--;
//                         }
//                     });
//                 };
//
//                 this.selectItem = (item) => {
//                     this.itemSelected({
//                         item: item
//                     });
//                 };
//             }
//         ]
//     });
