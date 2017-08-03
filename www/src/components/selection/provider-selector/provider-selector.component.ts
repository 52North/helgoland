import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ProviderSelectorService } from './provider-selector.service';

/**
 * Component to select an item out of a list of provider with a given filter combination.
 */
@Component({
    selector: 'n52-provider-selector',
    templateUrl: './provider-selector.component.html'
})
export class ProviderSelectorComponent implements OnInit {

    @Input()
    public providerList: any;

    @Input()
    public providerBlacklist: Array<any>;

    @Input()
    public supportStations: boolean;

    @Input()
    public selectedProvider: any;

    @Input()
    public filter: any;

    @Output()
    public onProviderSelected: EventEmitter<any> = new EventEmitter<any>();

    public providers: Array<any>;
    public loadingCount = 0;

    constructor(
        private providerSelectorService: ProviderSelectorService
    ) { }

    public ngOnInit(): any {
        let list = this.providerList;
        if (!Array.isArray(list)) list = Object.keys(list);
        this.loadingCount = list.length;
        this.providers = [];
        list.forEach((url) => {
            this.providerSelectorService.fetchProvidersOfAPI(url, this.providerBlacklist, this.filter)
                .subscribe((res) => {
                    this.loadingCount--;
                    if (res && res instanceof Array)
                        res.forEach((entry) => {
                            if (entry.quantities.platforms > 0
                                || this.supportStations && entry.quantities.stations > 0) {
                                this.providers.push(entry);
                            }
                        });
                    this.providers.sort((a, b) => {
                        if (a.label < b.label) return -1;
                        if (a.label > b.label) return 1;
                        return 0;
                    });
                }, () => {
                    this.loadingCount--;
                });
        });
    }

    public isSelected(provider: any) {
        if (!this.selectedProvider) return false;
        return this.selectedProvider.id === provider.id && this.selectedProvider.providerUrl === provider.providerUrl;
    }

    public selectProvider(provider: any) {
        this.onProviderSelected.emit(provider);
    }
}
