import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { HelgolandPlatform } from "@helgoland/core";
import { PlatformMapViewerComponent as ToolboxPlatformMapViewerComponent } from "@helgoland/map";
import * as L from "leaflet";

@Component({
  selector: 'app-platform-map-viewer',
  templateUrl: './platform-map-viewer.component.html',
  styleUrls: ['./platform-map-viewer.component.scss']
})
export class PlatformMapViewerComponent extends ToolboxPlatformMapViewerComponent implements OnChanges {

  private platformGeometry: L.GeoJSON;

  private platformLayer: L.MarkerClusterGroup;

  @Input() highlightPlatform: HelgolandPlatform;

  @Input() bounds: Array<L.LatLng>;

  @Output()
  public onClose: EventEmitter<Array<L.LatLng>> = new EventEmitter();

  ngAfterViewInit(): void {
    this.createMap();
    this.drawCustomPlatforms();
  }

  ngOnDestroy() {
    let bounds = this.map.getBounds();

    this.onClose.emit([
       new L.LatLng(bounds.getNorth(), bounds.getEast()),
       new L.LatLng(bounds.getSouth(), bounds.getWest())
    ]);
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (this.map) {
      if (changes.platforms) {
        this.drawCustomPlatforms();
      }
    }
    if (changes.highlightPlatform && this.highlightPlatform) {
      if (this.map) {
        let match: any;
        this.platformLayer.eachLayer((l: any) => {
          l.closeTooltip();
          if (l.feature.id === this.highlightPlatform.id) {
            match = l;
          }
        });

        if (match) {
          this.map.setView(match.getLatLng(), 10, { animate: true });
          setTimeout(() => match.openTooltip(), 300);
        }
      }
    }
  }

  private drawCustomPlatforms() {
    if (this.platforms) {
      if (this.platformLayer) {
        this.map.removeLayer(this.platformLayer);
      }
      this.platformLayer = L.markerClusterGroup({ animate: false, disableClusteringAtZoom: 10 });

      this.platformGeometry = L.geoJSON(null, {
        pointToLayer: (feature, latlng) => {
          if (this.customMarkerIcon) {
            return L.marker(latlng, { icon: this.customMarkerIcon });
          } else {
            return L.marker(latlng);
          }
        },
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(feature.properties?.platform?.label);
          layer.on('click', (evt) => {
            this.onSelectedPlatform.emit(evt.target.feature.properties.platform);
          })
        }
      });

      this.platforms.forEach(e => {
        if (e.geometry) {
          const feature: any = {
            geometry: e.geometry,
            id: e.id,
            properties: {
              platform: e
            },
            type: 'Feature'
          }
          this.platformGeometry.addData(feature);
        }
      })
      this.platformLayer.addLayer(this.platformGeometry);
      this.map.addLayer(this.platformLayer);

      if (this.bounds) {
        this.map.fitBounds(L.latLngBounds(this.bounds));
      } else {
        this.map.fitBounds(this.platformGeometry.getBounds());
      }
    }
  }

}
