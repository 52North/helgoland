import { Component, SimpleChanges } from '@angular/core';
import { PlatformMapViewerComponent as ToolboxPlatformMapViewerComponent } from '@helgoland/map';
import * as L from 'leaflet';

@Component({
  selector: 'app-platform-map-viewer',
  templateUrl: './platform-map-viewer.component.html',
  styleUrls: ['./platform-map-viewer.component.scss']
})
export class PlatformMapViewerComponent extends ToolboxPlatformMapViewerComponent {

  private platformGeometry: L.GeoJSON;

  private platformLayer: L.MarkerClusterGroup;

  ngAfterViewInit(): void {
    this.createMap();
    this.drawCustomPlatforms();
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (this.map) {
      if (changes.platforms) {
        this.drawCustomPlatforms();
      }
    }
  }

  private drawCustomPlatforms() {
    if (this.platforms) {
      if (this.platformLayer) {
        this.map.removeLayer(this.platformLayer);
      }
      this.platformLayer = L.markerClusterGroup({ animate: false });

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
      this.map.fitBounds(this.platformGeometry.getBounds());
    }
  }

}
