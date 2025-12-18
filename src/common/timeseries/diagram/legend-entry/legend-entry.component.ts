import { Component } from '@angular/core';
import { TimeseriesEntryComponent } from '@helgoland/depiction';

@Component({
  selector: 'n52-legend-entry',
  templateUrl: './legend-entry.component.html',
  styleUrls: ['./legend-entry.component.scss']
})
export class LegendEntryComponent extends TimeseriesEntryComponent {

  public showGeometry() {
    if (this.dataset.platform.geometry) {
      this.onShowGeometry.emit(this.dataset.platform.geometry);
    } else {
      this.servicesConnector.getPlatform(this.dataset.platform.id, this.dataset.url).subscribe(
        pf => this.onShowGeometry.emit(pf.geometry),
        error => console.error(error)
      );
    }
  }

  public getFixedCapabilitiesUrl(): string {
  if (!this.dataset?.url) {
    return '';
  }
  const baseUrl = this.dataset.url.split('?')[0];
  return `${baseUrl}?service=SOS&request=GetCapabilities`;
}

}
