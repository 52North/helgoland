import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  DatasetApiInterface,
  Station,
  Timeseries,
  Phenomenon
} from "@helgoland/core";
import { TimeseriesService } from './../services/timeseries.service';

export class ExtendedTimeseries extends Timeseries {
  public selected: boolean;
}

export class TimeSeriesGroup {
  public timeseries: ExtendedTimeseries[];
  public collapsed: boolean;
  public selectAll: boolean;
  public label: string;

  constructor(timeseries: ExtendedTimeseries[], collapsed: boolean, label: string) {
    this.timeseries = timeseries;
    this.collapsed = collapsed;
    this.label = label;
    this.selectAll = false;
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

  @Input()
  public sortAscending = false;

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
  
  constructor(
    protected apiInterface: DatasetApiInterface,
    private timeseriesService: TimeseriesService
    ) {}

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

  public toggle(timeseries: ExtendedTimeseries, timeSeriesGroup: TimeSeriesGroup) {
    timeseries.selected = !timeseries.selected;
    this.updateSelection();
    this.checkSelectedAll(timeSeriesGroup);
  }

  protected checkSelectedAll(timeSeriesGroup: TimeSeriesGroup){
    for (var _i = 0; _i < timeSeriesGroup.timeseries.length; _i++) {
      if(timeSeriesGroup.timeseries[_i].selected === false){
        timeSeriesGroup.selectAll = false;
        return;
      };
    }
    timeSeriesGroup.selectAll = true;
  }

  public toggleAll(timeSeriesGroup: TimeSeriesGroup) {
    timeSeriesGroup.selectAll = !timeSeriesGroup.selectAll;
      for (var _i = 0; _i < timeSeriesGroup.timeseries.length; _i++) {
        timeSeriesGroup.timeseries[_i].selected = timeSeriesGroup.selectAll;
      } 
    this.updateSelection();
  }

  protected prepareResult(result: ExtendedTimeseries, selection: boolean) {
    result.selected = selection;

    let group: TimeSeriesGroup;
    if(this.orderGroup){
      group = this.prepareOrderedCategoryGroup(result, this.sortAscending);
      group = this.prepareOrderedPhenomenonGroup(result, this.sortAscending);  
    }else{
      group = this.preparePhenomenonGroup(result);
      group = this.prepareCategoryGroup(result);
    }
    if(this.timeseriesService.datasetIds.includes(result.internalId)){
      this.toggle(result, group);
    }

    this.timeseriesList.push(result);
    this.updateSelection();
  }


  /**
   * Inserts a Timeseries result in an unordered map of {Timeseries} results
   * grouped by Phenomenons
   * @param result {Timeseries} result to insert
   */
  private preparePhenomenonGroup(result: ExtendedTimeseries): TimeSeriesGroup {
    let group: TimeSeriesGroup;
    const key = result.parameters.phenomenon.id;
    group = this.phenomenonMap.get(key);
    if (!group) {
      group = new TimeSeriesGroup([result], true, result.parameters.phenomenon.label);
      this.phenomenonMap.set(key, group);
    } else {
      group.timeseries.push(result);
    }
    return group;
  }

  /**
   * Inserts a Timeseries result in an unordered map of Timeseries results
   * grouped by Categories
   * @param result {Timeseries} result to insert
   */
  private prepareCategoryGroup(result: ExtendedTimeseries): TimeSeriesGroup {
    let group: TimeSeriesGroup;
    const key = result.parameters.category.id;
    group = this.categoryMap.get(key);
    if (!group) {
      group = new TimeSeriesGroup([result], true,  result.parameters.category.label);
      this.categoryMap.set(key, group);
    } else {
      group.timeseries.push(result);
    }
    return group;
  }

  /**
   * Inserts a Timeseries result into an ordered list of Timeseries results
   * grouped by Categories and dependent on the specified order strategey
   * @param result {Timeseries} result to insert
   * @param asc the ordering strategy (true for ascending ordering, false for descending ordering)
   */
  private prepareOrderedCategoryGroup(result: ExtendedTimeseries, asc: Boolean): TimeSeriesGroup {
    const length = this.categoryList.length;
    const resValue = parseFloat(result.parameters.category.label);
      for (var _i = 0; _i < length; _i++) {
        let actValue = parseFloat(this.categoryList[_i].label);
        if(resValue === actValue){
          let group = this.categoryList[_i];
          const tsLength = group.timeseries.length;
          // Determine position to insert the phenomenon
          // regarding the lexigraphical order
          for (var _j = 0; _j < tsLength; _j++){
            if(result.parameters.phenomenon.label < group.timeseries[_j].parameters.phenomenon.label){
              group.timeseries.splice(_j, 0, result);
              return group;
            }
          }
          group.timeseries.push(result);
          return group;
        }
        // check if result values should be sorted ascending or descending
        if(asc ? resValue < actValue : resValue > actValue){
          let group = new TimeSeriesGroup([result], true,  result.parameters.category.label);
          this.categoryList.splice(_i, 0, group);
          return group;
        }
      }
      let group = new TimeSeriesGroup([result], true,  result.parameters.category.label);
      this.categoryList.push(group);
      return group;
  }

    /**
   * Inserts a Timeseries result into an ordered list of Timeseries results
   * grouped by Phenomenons and dependent on the specified order strategey
   * @param result the Timeseries result to inster
   * @param asc the ordering strategy (true for ascending ordering, false for descending ordering)
   */
  private prepareOrderedPhenomenonGroup(result: ExtendedTimeseries, asc: Boolean): TimeSeriesGroup {
    const length = this.phenomenonList.length;
    const resValue = parseFloat(result.parameters.category.label);
      for (var _i = 0; _i < length; _i++) {
        if(result.parameters.phenomenon.label === this.phenomenonList[_i].label){
          const timeseriesLength = this.phenomenonList[_i].timeseries.length;
          for(var _j = 0; _j < timeseriesLength; _j++){
            let actValue = parseFloat(this.phenomenonList[_i].timeseries[_j].parameters.category.label);
            if(resValue === actValue){
              let group = this.phenomenonList[_i];
              this.phenomenonList[_i].timeseries.push(result);
              return group;
            }
            // check if result values should be sorted ascending or descending
            if(asc ? resValue < actValue : resValue > actValue){
              let group = this.phenomenonList[_i];
              group.timeseries.splice(_j, 0, result);
              return group;
            }
          }
          let group = this.phenomenonList[_i];
          group.timeseries.push(result);
          return group;
        }
        // if Phenomenon group does not exist, determine position
        // to insert new group regarding the lexigraphical order
        if(result.parameters.phenomenon.label < this.phenomenonList[_i].label){
          let group = new TimeSeriesGroup([result], true, result.parameters.phenomenon.label);
          this.phenomenonList.splice(_i, 0, group);
          return group;
        }
      }
      let group = new TimeSeriesGroup([result], true, result.parameters.phenomenon.label);
      this.phenomenonList.push(group);
      return group;
  }


  private updateSelection() {
    const selection = this.timeseriesList.filter(entry => entry.selected);
    this.onSelectionChanged.emit(selection);
  }
}
