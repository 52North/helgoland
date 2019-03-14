import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  DatasetApiInterface,
  Station,
  Timeseries,
  Phenomenon
} from "@helgoland/core";

export class ExtendedTimeseries extends Timeseries {
  public selected: boolean;
}

export class TimeSeriesGroup {
  public timeseries: ExtendedTimeseries[];
  public collapsed: boolean;
  public label: string;

  constructor(timeseries: ExtendedTimeseries[], collapsed: boolean, label: string) {
    this.timeseries = timeseries;
    this.collapsed = collapsed;
    this.label = label;
  }
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

  @Input()
  public orderGroup = false;

  @Output()
  public onSelectionChanged: EventEmitter<Timeseries[]> = new EventEmitter<
    Timeseries[]
  >();

  public timeseriesList: ExtendedTimeseries[] = [];

  public phenomenonMap: Map<string, TimeSeriesGroup> = new Map();
  public categoryMap: Map<string, TimeSeriesGroup> = new Map();

  public categoryList: TimeSeriesGroup[] = [];
  public phenomenonList: TimeSeriesGroup[] = [];

  public counter: number;

  public filterCategory = "phenomenon";

  public isCollapsed = true; 
  
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

    if(this.orderGroup){
      this.prepareCategories(result);
      this.preparePhenomenons(result);  
    }else{
      this.preparePhenomenonGroup(result);
      this.prepareCategoryGroup(result);
    }

    this.timeseriesList.push(result);
    this.updateSelection();
  }


  private preparePhenomenonGroup(result: ExtendedTimeseries) {
    const key = result.parameters.phenomenon.id;
    const collection = this.phenomenonMap.get(key);
    if (!collection) {
      let group = new TimeSeriesGroup([result], true, result.parameters.phenomenon.label);
      this.phenomenonMap.set(key, group);
    } else {
      collection.timeseries.push(result);
    }
  }

  private prepareCategoryGroup(result: ExtendedTimeseries) {
    const key = result.parameters.category.id;
    const collection = this.categoryMap.get(key);
    if (!collection) {
      let group = new TimeSeriesGroup([result], true,  result.parameters.category.label);
      this.categoryMap.set(key, group);
    } else {
      collection.timeseries.push(result);
    }
  }

  private prepareCategories(result: ExtendedTimeseries) {
    const length = this.categoryList.length;
    const resValue = parseInt(result.parameters.category.label.slice(0, -1));
      for (var _i = 0; _i < length; _i++) {
        let actValue = parseInt(this.categoryList[_i].label.slice(0, -1));
        if(resValue === actValue){
          this.categoryList[_i].timeseries.push(result);
          return;
        }
        if(resValue < actValue){
          let group = new TimeSeriesGroup([result], true,  result.parameters.category.label);
          this.categoryList.splice(_i, 0, group);
          return;
        }
      }
      let group = new TimeSeriesGroup([result], true,  result.parameters.category.label);
      this.categoryList.push(group);
  }

  private preparePhenomenons(result: ExtendedTimeseries) {
    const length = this.phenomenonList.length;
    const resValue = parseInt(result.parameters.category.label.slice(0, -1));
      for (var _i = 0; _i < length; _i++) {
        if(result.parameters.phenomenon.label === this.phenomenonList[_i].label){
          const timeseriesLength = this.phenomenonList[_i].timeseries.length;
          for(var _j = 0; _j < timeseriesLength; _j++){
            let actValue = parseInt(this.phenomenonList[_i].timeseries[_j].parameters.category.label.slice(0, -1));
            if(resValue === actValue){
              this.phenomenonList[_i].timeseries.push(result);
              return;
            }
            if(resValue < actValue){
              this.phenomenonList[_i].timeseries.splice(_j, 0, result);
              return;
            }
          }
        }
      }
      let group = new TimeSeriesGroup([result], true, result.parameters.phenomenon.label);
      this.phenomenonList.push(group);
  }


  private updateSelection() {
    const selection = this.timeseriesList.filter(entry => entry.selected);
    this.onSelectionChanged.emit(selection);
  }
}
