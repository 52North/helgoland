import { Router } from '@angular/router';
import { TimeseriesService } from './../services/timeseries.service';
import { TimeseriesProviderSelectionService } from './../provider-selection/provider-selection.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-selection',
  templateUrl: './list-selection.component.html',
  styleUrls: ['./list-selection.component.scss']
})
export class TimeseriesListSelectionComponent implements OnInit {

  public categoryParams = [{
    type: 'category',
    header: 'Kategorie'
  }, {
    type: 'feature',
    header: 'Station'
  }, {
    type: 'phenomenon',
    header: 'Phänomen'
  }, {
    type: 'procedure',
    header: 'Sensor'
  }];

  public stationParams = [{
    type: 'feature',
    header: 'Station'
  }, {
    type: 'category',
    header: 'Kategorie'
  }, {
    type: 'phenomenon',
    header: 'Phänomen'
  }, {
    type: 'procedure',
    header: 'Sensor'
  }];

  public phenomenonParams = [{
    type: 'phenomenon',
    header: 'Phänomen'
  }, {
    type: 'category',
    header: 'Kategorie'
  }, {
    type: 'feature',
    header: 'Station'
  }, {
    type: 'procedure',
    header: 'Sensor'
  }];

  public procedureParams = [{
    type: 'procedure',
    header: 'Sensor'
  }, {
    type: 'feature',
    header: 'Station'
  }, {
    type: 'phenomenon',
    header: 'Phänomen'
  }, {
    type: 'category',
    header: 'Kategorie'
  }];

  public providerList;

  constructor(
    private providerCache: TimeseriesProviderSelectionService,
    private timeseriesService: TimeseriesService,
    private router: Router
  ) { }

  public ngOnInit() {
    const provider = this.providerCache.getSelectedProvider();
    if (provider) {
      this.providerList = [
        {
          url: provider.providerUrl,
          serviceID: provider.id
        }
      ];
    }
  }

  public onDatasetSelected(datasetList, url) {
    if (datasetList instanceof Array && datasetList.length === 1) {
      this.timeseriesService.addTimeseries(datasetList[0], url);
      this.router.navigate(['timeseries/diagram']);
    } else {
      console.error('datasetList is no array or has not the length of 1');
    }
  }


}
