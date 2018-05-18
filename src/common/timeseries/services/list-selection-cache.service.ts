import { Injectable } from '@angular/core';
import { Service } from '@helgoland/core';

@Injectable()
export class TimeseriesListSelectionCache {
    public selectedService: Service;
    public lastTab: string;
}
