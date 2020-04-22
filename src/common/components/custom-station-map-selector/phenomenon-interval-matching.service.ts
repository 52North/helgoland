import { Injectable } from '@angular/core';
import { FirstLastValue, HttpService, Parameter } from '@helgoland/core';

export interface Interval {
  lower: number;
  upper: number;
  color: string;
}

export interface IntervalEntry {
  name: string;
  intervals: Interval[];
}

@Injectable({
  providedIn: 'root'
})
export class PhenomenonIntervalMatchingService {

  private intervals: IntervalEntry[];

  constructor(
    private http: HttpService
  ) {
    this.http.client().get<IntervalEntry[]>('/assets/intervals.json').subscribe(
      res => this.intervals = res,
    );
  }

  getColor(phenomenon: Parameter, lastValue: FirstLastValue): string {
    const matchedEntry = this.intervals.find(e => e.name === phenomenon.label);
    if (matchedEntry) {
      const matchedInterval = matchedEntry.intervals.find(e => e.lower <= lastValue.value && e.upper >= lastValue.value);
      if (matchedInterval) {
        return matchedInterval.color;
      }
    }
  }

}
