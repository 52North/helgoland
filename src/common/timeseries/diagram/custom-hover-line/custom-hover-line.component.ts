import { Component, ViewEncapsulation } from '@angular/core';
import { TimezoneService } from '@helgoland/core';
import {
  D3GraphHelperService,
  D3GraphHoverLineComponent,
  D3GraphId,
  D3Graphs,
  DataEntry,
  HoverlineLabel,
  InternalDataEntry,
} from '@helgoland/d3';

@Component({
  selector: 'app-custom-hover-line',
  template: '',
  styleUrls: ['./custom-hover-line.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomHoverLineComponent extends D3GraphHoverLineComponent {

  constructor(
    protected graphId: D3GraphId,
    protected graphs: D3Graphs,
    protected graphHelper: D3GraphHelperService,
    protected timezoneSrvc: TimezoneService
  ) {
    super(graphId, graphs, graphHelper, timezoneSrvc);
  }

  protected setLabel(label: HoverlineLabel, item: DataEntry, entry: InternalDataEntry) {
    label.text.selectAll('*').remove();
    const timeseries = this.d3Graph.getDataset(entry.internalId);
    label.text.append('text').text(`${timeseries.platform.label}`).attr('dominant-baseline', 'text-before-edge').attr('class', 'hoverline-label-text');
    label.text.append('text').text(`${timeseries.parameters.phenomenon.label} in ${timeseries.parameters.category.label}`).attr('dy', '1em').attr('dominant-baseline', 'text-before-edge').attr('class', 'hoverline-label-text');
    label.text.append('text').text(`${item.value} ${(entry.axisOptions.uom ? entry.axisOptions.uom : '')}`).attr('dy', '2em').attr('dominant-baseline', 'text-before-edge').attr('class', 'hoverline-label-text');
  }

}
