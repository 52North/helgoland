import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ListSelectorParameter } from './../../toolbox/components/selection/list-selector/list-selector.component';
import { IDataset } from './../../toolbox/model/api/dataset/idataset';
import { Provider } from './../../toolbox/model/internal/provider';
import { TimeseriesProviderSelectionService } from './../provider-selection/provider-selection.service';
import { TimeseriesService } from './../services/timeseries.service';

@Component({
  selector: 'n52-list-selection',
  templateUrl: './list-selection.component.html',
  styleUrls: ['./list-selection.component.scss']
})
export class TimeseriesListSelectionComponent implements OnInit {

  public categoryParams: Array<ListSelectorParameter> = [{
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

  public stationParams: Array<ListSelectorParameter> = [{
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

  public phenomenonParams: Array<ListSelectorParameter> = [{
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

  public procedureParams: Array<ListSelectorParameter> = [{
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

  public providerList: Array<Provider>;

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
          id: provider.id
        }
      ];
    }
  }

  public onDatasetSelected(datasetList: Array<IDataset>) {
    if (datasetList instanceof Array && datasetList.length === 1) {
      this.timeseriesService.addDataset(datasetList[0]);
      this.router.navigate(['timeseries/diagram']);
    } else {
      console.error('datasetList is no array or has not the length of 1');
    }
  }
}
