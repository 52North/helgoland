import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  DatasetApiInterface,
  Station,
  Timeseries,
  Phenomenon
} from "@helgoland/core";
import { groupBy, mergeMap, toArray } from "rxjs/operators";
import { from } from "rxjs";

export class ExtendedTimeseries extends Timeseries {
  public selected: boolean;
}

@Component({
  selector: "n52-category-selector",
  templateUrl: "./category-selector.component.html",
  styleUrls: ["./category-selector.component.scss"]
})
export class CategorySelectorComponent implements OnInit {
  @Input()
  public station: Station;

  @Input()
  public url: string;

  @Input()
  public defaultSelected = false;

  @Input()
  public phenomenonId: string;

  @Output()
  public onSelectionChanged: EventEmitter<Timeseries[]> = new EventEmitter<
    Timeseries[]
  >();

  public timeseriesList: ExtendedTimeseries[] = [];

  public phenomenonMap: Map<string, ExtendedTimeseries[]> = new Map();
  public categoryMap: Map<string, ExtendedTimeseries[]> = new Map();

  public counter: number;

  constructor(protected apiInterface: DatasetApiInterface) {}

  public ngOnInit() {
    if (this.station) {
      const stationId =
        this.station.properties && this.station.properties.id
          ? this.station.properties.id
          : this.station.id;
      this.apiInterface.getStation(stationId, this.url).subscribe(station => {
        this.station = station;
        this.counter = 0;
        for (const id in this.station.properties.timeseries) {
          if (this.station.properties.timeseries.hasOwnProperty(id)) {
            this.counter++;
            this.apiInterface.getSingleTimeseries(id, this.url).subscribe(
              result => {
                this.prepareResult(
                  result as ExtendedTimeseries,
                  this.defaultSelected
                );
                this.counter--;
              },
              error => {
                this.counter--;
              }
            );
          }
        }
      });
    }
  }

  public toggle(timeseries: ExtendedTimeseries) {
    timeseries.selected = !timeseries.selected;
    this.updateSelection();
  }

  protected prepareResult(result: ExtendedTimeseries, selection: boolean) {
    result.selected = selection;
    this.prepareCategoryGroup(result);
    this.preparePhenomenonGroup(result);

    this.timeseriesList.push(result);
    this.updateSelection();
  }

  private preparePhenomenonGroup(result: ExtendedTimeseries) {
    const key = result.parameters.phenomenon.id;
    const collection = this.phenomenonMap.get(key);
    if (!collection) {
      this.phenomenonMap.set(key, [result]);
    } else {
      collection.push(result);
    }
  }

  private prepareCategoryGroup(result: ExtendedTimeseries) {
    const key = result.parameters.category.id;
    const collection = this.categoryMap.get(key);
    if (!collection) {
      this.categoryMap.set(key, [result]);
    } else {
      collection.push(result);
    }
  }

  private updateSelection() {
    const selection = this.timeseriesList.filter(entry => entry.selected);
    this.onSelectionChanged.emit(selection);
  }
}
