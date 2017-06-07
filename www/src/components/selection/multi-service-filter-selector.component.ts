import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ApiInterface } from '../../services/api-interface';
import { Parameter } from '../../model';

/**
 * Component to select an item out of a list of provider with a given filter combination.
 */
@Component({
    selector: 'multi-service-filter-selector',
    template: require('./multi-service-filter-selector.component.html')
})
export class MultiServiceFilterSelectorComponent implements OnChanges {

    @Input()
    public endpoint: string;

    @Input()
    public filterList: any;

    @Output()
    public itemSelected: EventEmitter<Parameter> = new EventEmitter<Parameter>();

    private items: Array<Parameter>;
    private loading: number = 0;

    constructor(
        private apiInterface: ApiInterface
    ) { }

    public ngOnChanges(changes: SimpleChanges): any {
        this.items = [];
        this.filterList.forEach((entry) => {
            this.loading++;
            const filter = entry.filter || {};
            filter.service = entry.serviceID;
            switch (this.endpoint) {
                case 'offering':
                    this.apiInterface.getOfferings(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, entry.serviceID),
                        (error) => this.errorOnLoading
                    );
                    break;
                case 'phenomenon':
                    this.apiInterface.getPhenomena(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, entry.serviceID),
                        (error) => this.errorOnLoading
                    );
                    break;
                case 'procedure':
                    this.apiInterface.getProcedures(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, entry.serviceID),
                        (error) => this.errorOnLoading
                    );
                    break;
                case 'feature':
                    this.apiInterface.getFeatures(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, entry.serviceID),
                        (error) => this.errorOnLoading
                    );
                    break;
                case 'category':
                    this.apiInterface.getCategories(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, entry.serviceID),
                        (error) => this.errorOnLoading
                    );
                    break;
                default:
                    console.error('Wrong endpoint: ' + this.endpoint);
                    this.loading--;
            }
        });
    }

    onSelectItem(item): void {
        this.itemSelected.emit(item);
    }

    private errorOnLoading(): void {
        this.loading--;
    }

    private setItems(res: Array<Parameter>, prevfilter, url, serviceID): void {
        this.loading--;
        res.forEach((entry: any) => {
            const filter = {
                filter: prevfilter,
                itemId: entry.id,
                url,
                serviceID
            };
            const item: any = this.items.find((elem) => {
                if (elem.label === entry.label) return true;
            });
            if (item) {
                item.filterList.push(filter);
            } else {
                entry.filterList = [filter];
                this.items.push(entry);
            }
        });
    }
}

// require('../selection');
// angular.module('n52.core.selection')
//     .component('multiServiceFilterSelector', {
//         controller: ['seriesApiInterface',
//             function(seriesApiInterface) {
//                 this.items = [];
//                 this.loading = 0;
//
//                 this.selectItem = (item) => {
//                     this.itemSelected({
//                         item: item
//                     });
//                 };
//             }
//         ]
//     });
