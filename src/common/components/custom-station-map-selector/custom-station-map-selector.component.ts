import { ChangeDetectorRef, Component, KeyValueDiffers } from '@angular/core';
import {
  HelgolandParameterFilter,
  HelgolandServicesConnector,
  HelgolandTimeseries,
  StatusIntervalResolverService,
} from '@helgoland/core';
import { MapCache, StationMapSelectorComponent } from '@helgoland/map';
import * as L from 'leaflet';

import { PhenomenonIntervalMatchingService } from './phenomenon-interval-matching.service';

@Component({
  selector: 'n52-custom-station-map-selector',
  templateUrl: './custom-station-map-selector.component.html',
  styleUrls: ['./custom-station-map-selector.component.scss']
})
export class CustomStationMapSelectorComponent extends StationMapSelectorComponent {

  constructor(
    protected statusIntervalResolver: StatusIntervalResolverService,
    protected servicesConnector: HelgolandServicesConnector,
    protected mapCache: MapCache,
    protected kvDiffers: KeyValueDiffers,
    protected cd: ChangeDetectorRef,
    protected intervalMatching: PhenomenonIntervalMatchingService,
  ) {
    super(statusIntervalResolver, servicesConnector, mapCache, kvDiffers, cd);
  }

  protected createValuedMarkers() {
    const tempFilter: HelgolandParameterFilter = {
      phenomenon: this.filter.phenomenon,
      expanded: true
    };
    this.servicesConnector.getDatasets(this.serviceUrl, tempFilter).subscribe(
      datasets => {
        this.markerFeatureGroup = L.featureGroup();
        datasets.forEach((ds: HelgolandTimeseries) => {
          let marker;
          if (ds.lastValue) {
            const color = this.intervalMatching.getColor(ds.parameters.phenomenon, ds.lastValue);
            if (color) {
              marker = this.createColoredMarker(ds.platform, color);
            }
          }
          if (!marker) { marker = this.createDefaultColoredMarker(ds.platform); }
          marker.on('click', () => this.onSelected.emit(ds.platform));
          this.markerFeatureGroup.addLayer(marker);
        });

        this.zoomToMarkerBounds(this.markerFeatureGroup.getBounds());
        if (this.map) { this.map.invalidateSize(); }
        this.onContentLoading.emit(false);

        if (this.map) { this.markerFeatureGroup.addTo(this.map); }
      },
      error => console.error(error)
    );
  }
}
