import { Component } from '@angular/core';
import { TimeseriesEntryComponent } from '@helgoland/depiction';

@Component({
  selector: 'n52-legend-entry',
  templateUrl: './legend-entry.component.html',
  styleUrls: ['./legend-entry.component.scss']
})
export class LegendEntryComponent extends TimeseriesEntryComponent {

  public urlToPDF: string;

  public setParameters() {
    super.setParameters();
    if (this.dataset.url === 'https://aqsens.52north.org/data/raw/sta/') {
      this.urlToPDF = 'https://52north.org/delivery/annual_report/52North_Annual_Report_2019_web.pdf'
    }
  }

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

}
