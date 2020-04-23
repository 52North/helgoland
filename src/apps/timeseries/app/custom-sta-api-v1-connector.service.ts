import { Injectable } from '@angular/core';
import {
  DatasetFilter,
  HelgolandData,
  HelgolandDataFilter,
  HelgolandDataset,
  HelgolandTimeseries,
  HelgolandTimeseriesData,
  InternalDatasetId,
  StaApiV1Connector,
  Timespan,
} from '@helgoland/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


// TODO: remove hard coded manipulation of data

@Injectable({
  providedIn: 'root'
})
export class CustomStaApiV1ConnectorService extends StaApiV1Connector {

  name = 'CustomStaApiV1ConnectorService';

  getDatasetData(ds: HelgolandDataset, timespan: Timespan, filter: HelgolandDataFilter): Observable<HelgolandData> {
    return super.getDatasetData(ds, timespan, filter).pipe(
      map(res => {
        if (res instanceof HelgolandTimeseriesData && ds instanceof HelgolandTimeseries) {
          if (
            ds.parameters.phenomenon.label === 'Ozone'
            // ds.parameters.phenomenon.label === 'Nitrogen_dioxide' ||
            // ds.parameters.phenomenon.label === 'Carbon_monoxide'
          ) {
            res.values.forEach(e => e[1] = e[1] / 1000);
          }
        }
        return res;
      })
    );
  }

  getDataset(internalId: InternalDatasetId, filter: DatasetFilter): Observable<HelgolandDataset> {
    return super.getDataset(internalId, filter).pipe(
      map(res => this.modifyDataset(res))
    );
  }

  getDatasets(url: string, filter: DatasetFilter): Observable<HelgolandDataset[]> {
    return super.getDatasets(url, filter).pipe(
      map(res => res.map(e => this.modifyDataset(e)))
    );
  }

  modifyDataset(ds: HelgolandDataset): HelgolandDataset {
    if (ds instanceof HelgolandTimeseries) {
      if (
        ds.parameters.phenomenon.label === 'Ozone'
        // ds.parameters.phenomenon.label === 'Nitrogen_dioxide' ||
        // ds.parameters.phenomenon.label === 'Carbon_monoxide'
      ) {
        if (ds.lastValue) {
          ds.lastValue.value = ds.lastValue.value / 1000;
        }
        if (ds.firstValue) {
          ds.firstValue.value = ds.firstValue.value / 1000;
        }
      }
    }
    return ds;
  }

}
