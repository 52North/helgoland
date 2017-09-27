import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Parameter } from './../../../model/api/parameter';
import { ParameterFilter } from './../../../model/api/parameterFilter';
import { Filter } from './../../../model/internal/filter';
import { FilteredProvider } from './../../../model/internal/provider';
import { ApiInterface } from './../../../services/api-interface/api-interface.service';

/**
 * Component to select an item out of a list of provider with a given filter combination.
 */
@Component({
    selector: 'n52-multi-service-filter-selector',
    templateUrl: './multi-service-filter-selector.component.html'
})
export class MultiServiceFilterSelectorComponent implements OnChanges {

    @Input()
    public endpoint: string;

    @Input()
    public filterList: Array<FilteredProvider>;

    @Output()
    public onItemSelected: EventEmitter<FilteredParameter> = new EventEmitter<FilteredParameter>();

    public loading = 0;
    public items: Array<FilteredParameter>;

    constructor(
        private apiInterface: ApiInterface
    ) { }

    public ngOnChanges(changes: SimpleChanges) {
        this.items = [];
        this.filterList.forEach((entry) => {
            this.loading++;
            const filter = entry.filter || {};
            filter.service = entry.id;
            switch (this.endpoint) {
                case 'offering':
                    this.apiInterface.getOfferings(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, filter.service),
                        (error) => this.errorOnLoading
                    );
                    break;
                case 'phenomenon':
                    this.apiInterface.getPhenomena(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, filter.service),
                        (error) => this.errorOnLoading
                    );
                    break;
                case 'procedure':
                    this.apiInterface.getProcedures(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, filter.service),
                        (error) => this.errorOnLoading
                    );
                    break;
                case 'feature':
                    this.apiInterface.getFeatures(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, filter.service),
                        (error) => this.errorOnLoading
                    );
                    break;
                case 'category':
                    this.apiInterface.getCategories(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, filter.service),
                        (error) => this.errorOnLoading
                    );
                    break;
                case 'platform':
                    this.apiInterface.getPlatforms(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, filter.service),
                        (error) => this.errorOnLoading
                    );
                    break;
                case 'dataset':
                    this.apiInterface.getDatasets(entry.url, filter).subscribe(
                        (res) => this.setItems(res, filter, entry.url, filter.service),
                        (error) => this.errorOnLoading
                    );
                    break;
                default:
                    console.error('Wrong endpoint: ' + this.endpoint);
                    this.loading--;
            }
        });
    }

    onSelectItem(item: FilteredParameter): void {
        this.onItemSelected.emit(item);
    }

    private errorOnLoading(): void {
        this.loading--;
    }

    private setItems(res: Array<FilteredParameter>, prevfilter: ParameterFilter, url: string, service: string): void {
        this.loading--;
        res.forEach((entry) => {
            const filter: Filter = {
                filter: prevfilter,
                itemId: entry.id,
                url,
                service
            };
            const item = this.items.find((elem) => {
                if (elem.label === entry.label) { return true; }
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

export interface FilteredParameter extends Parameter {
    filterList?: Array<Filter>;
}
