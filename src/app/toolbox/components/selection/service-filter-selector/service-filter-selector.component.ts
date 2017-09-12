import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Parameter } from './../../../model/api/parameter';
import { ApiInterface } from './../../../services/api-interface/api-interface.service';

/**
 * Component to select an item out of a list of provider with a given filter combination.
 */
@Component({
    selector: 'n52-service-filter-selector',
    templateUrl: './service-filter-selector.component.html'
})
export class ServiceFilterSelectorComponent implements OnChanges {

    @Input()
    public endpoint: string;

    @Input()
    public serviceUrl: string;

    @Input()
    public filter;

    @Input()
    public selectionId: string;

    @Output()
    public onItemSelected: EventEmitter<Parameter> = new EventEmitter<Parameter>();

    public loading: boolean;
    public items: Array<Parameter>;

    constructor(
        private apiInterface: ApiInterface
    ) { }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.endpoint) {
            this.loading = true;
            switch (this.endpoint) {
                case 'offering':
                    this.apiInterface.getOfferings(this.serviceUrl, this.filter).subscribe(
                        (res) => this.setItems(res),
                        (error) => this.errorOnLoading
                    );
                    break;
                case 'phenomenon':
                    this.apiInterface.getPhenomena(this.serviceUrl, this.filter).subscribe(
                        (res) => this.setItems(res),
                        (error) => this.errorOnLoading
                    );
                    break;
                case 'procedure':
                    this.apiInterface.getProcedures(this.serviceUrl, this.filter).subscribe(
                        (res) => this.setItems(res),
                        (error) => this.errorOnLoading
                    );
                    break;
                case 'category':
                    this.apiInterface.getCategories(this.serviceUrl, this.filter).subscribe(
                        (res) => this.setItems(res),
                        (error) => this.errorOnLoading
                    );
                    break;
                case 'feature':
                    this.apiInterface.getFeatures(this.serviceUrl, this.filter).subscribe(
                        (res) => this.setItems(res),
                        (error) => this.errorOnLoading
                    );
                    break;
                default:
                    console.error('Wrong endpoint: ' + this.endpoint);
            }
        }
    }

    public onSelectItem(item: Parameter): void {
        this.onItemSelected.emit(item);
    }

    private errorOnLoading(): void {
        this.loading = false;
    }

    private setItems(res: Array<Parameter>): void {
        if (res instanceof Array) {
            this.items = res;
        } else {
            this.items = [];
        }
        this.loading = false;
    }
}
