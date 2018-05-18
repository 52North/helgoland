import { Injectable } from '@angular/core';
import { Service } from '@helgoland/core';

@Injectable()
export class TimeseriesMapSelectionCache {
    public selectedService: Service;
    public lastTab: string;
}
