import { Component, ViewEncapsulation } from '@angular/core';
import { Timespan, TimezoneService } from '@helgoland/core';
import {
  D3GraphExtent,
  D3GraphHelperService,
  D3GraphHoverLineComponent,
  D3GraphId,
  D3Graphs,
  DataEntry,
  HoverlineLabel,
  InternalDataEntry,
} from '@helgoland/d3';
import * as d3 from 'd3';

interface LabelConfig {
  label: string;
  color: string;
}

@Component({
  selector: 'app-custom-hover-line',
  template: '',
  styleUrls: ['./custom-hover-line.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomHoverLineComponent extends D3GraphHoverLineComponent {

  aggLabel: HoverlineLabel;

  constructor(
    protected graphId: D3GraphId,
    protected graphs: D3Graphs,
    protected graphHelper: D3GraphHelperService,
    protected timezoneSrvc: TimezoneService
  ) {
    super(graphId, graphs, graphHelper, timezoneSrvc);
  }

  adjustBackground(
    background: d3.Selection<SVGSVGElement, any, any, any>,
    graphExtent: D3GraphExtent,
    preparedData: InternalDataEntry[],
    graph: d3.Selection<SVGSVGElement, any, any, any>,
    timespan: Timespan
  ): void {
    super.adjustBackground(background,graphExtent, preparedData, graph, timespan);
    this.aggLabel = undefined;
  }

  protected setLabel(label: HoverlineLabel, item: DataEntry, entry: InternalDataEntry) {
    label.text.selectAll('*').remove();
    const timeseries = this.d3Graph.getDataset(entry.internalId);
    label.text.append('text').text(`${timeseries.platform.label}`).attr('dominant-baseline', 'text-before-edge').attr('class', 'hoverline-label-text');
    label.text.append('text').text(`${timeseries.parameters.phenomenon.label} in ${timeseries.parameters.category.label}`).attr('dy', '1em').attr('dominant-baseline', 'text-before-edge').attr('class', 'hoverline-label-text');
    label.text.append('text').text(`${item.value} ${(entry.axisOptions.uom ? entry.axisOptions.uom : '')}`).attr('dy', '2em').attr('dominant-baseline', 'text-before-edge').attr('class', 'hoverline-label-text');
  }

  protected moveHoverLineIndicator(): void {
    const time = new Date().getTime();
    if (this.lastDraw + this.drawLatency < time) {
      const mouse = d3.mouse(this.background.node());
      this.drawLineIndicator(mouse);
      if (this.showLabels) {
        const labelMapping: Map<string, LabelConfig[]> = new Map();
        this.preparedData.forEach((entry, entryIdx) => {
          const idx = this.getItemForX(mouse[0] + this.graphExtent.leftOffset, entry.data);
          if (idx !== undefined) {
            const timeseries = this.d3Graph.getDataset(entry.internalId);
            const group = `${timeseries.platform.label} - ${timeseries.parameters.phenomenon.label}`;
            const conf: LabelConfig = {
              label: `in ${timeseries.parameters.category.label} ${entry.data[idx].value} ${(entry.axisOptions.uom ? entry.axisOptions.uom : '')}`,
              color: entry.options.color
            }
            if (labelMapping.has(group)) {
              labelMapping.get(group).push(conf);
            } else {
              labelMapping.set(group, [conf]);
            }
          }
        })
        if (!this.aggLabel) {
          this.aggLabel = this.createAggLabel();
        }
        if (labelMapping.size > 0) {
          this.updateAggLabel(labelMapping);
          this.positionAggregatedLabel(this.aggLabel, mouse[0] + this.graphExtent.leftOffset, mouse[1]);
          this.displayLabel(this.aggLabel, true);
        } else {
          this.displayLabel(this.aggLabel, false);
        }
      }
      this.lastDraw = time;
    }
  }

  private updateAggLabel(labelMapping: Map<string, LabelConfig[]>) {
    this.aggLabel.text.selectAll('*').remove();
    const labelLineWidth = 4;
    let lineIdx = 0;
    labelMapping.forEach((val, key) => {
      this.aggLabel.text.append('text').text(`${key}`).attr('dominant-baseline', 'text-before-edge').attr('class', 'hoverline-label-text').attr('dy', `${lineIdx}em`);
      lineIdx += 1;
      val.forEach(l => {
        this.aggLabel.text.append('svg:rect').style('fill', l.color).style('stroke', l.color).style('stroke-width', '1px').attr('width', 10).attr('height', labelLineWidth).attr('y', `${lineIdx * 16 + (16 - labelLineWidth) / 2}px`);
        this.aggLabel.text.append('text').text(`${l.label}`).attr('dominant-baseline', 'text-before-edge').attr('class', 'hoverline-label-text').attr('dy', `${lineIdx}em`).attr('dx', `1em`);
        lineIdx += 1;
      })
    });
  }

  private createAggLabel(): HoverlineLabel {
    const rect = this.drawLayer.append('svg:rect')
      .attr('class', 'hoverline-label-rect')
      .style('fill', 'white')
      .style('stroke', 'gray')
      .style('stroke-width', '1px')
      .style('pointer-events', 'none');
    const text = this.drawLayer.append('g');
    return { rect, text }
  }

  private positionAggregatedLabel(label: HoverlineLabel, xCoord: number, yCoord: number): void {
    const padding = 2;
    const entryX: number = this.checkLeftSide(xCoord) ? xCoord + 4 : xCoord - this.graphHelper.getDimensions(label.text.node()).w - 4;
    label.text.attr('transform', `translate(${entryX + padding}, ${yCoord + padding})`);
    label.rect
      .attr('x', entryX)
      .attr('y', yCoord)
      .attr('width', this.graphHelper.getDimensions(label.text.node()).w + padding * 2)
      .attr('height', this.graphHelper.getDimensions(label.text.node()).h + padding * 2);
  }

}
