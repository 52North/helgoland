import { Component, SimpleChanges } from '@angular/core';
import { Timespan } from '@helgoland/core';
import { TimeseriesEntryComponent } from '@helgoland/depiction';
import { LangChangeEvent } from '@ngx-translate/core';
import * as moment from 'moment';

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

}
