import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { HelgolandTimeseries, StaReadInterfaceService } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'n52-min-max-value-component',
  templateUrl: './min-max-value-component.component.html',
  styleUrls: ['./min-max-value-component.component.scss']
})
export class MinMaxValueComponentComponent implements OnChanges {

  @Input() dataset: HelgolandTimeseries;

  @Input() maxValue = true;

  @Output() selectValue: EventEmitter<Date> = new EventEmitter();

  public value: string;
  public valueDate: Date;

  constructor(
    private sta: StaReadInterfaceService,
    public translateSrvc: TranslateService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataset) {
      this.fetchValue();
    }
  }

  fetchValue() {
    if (this.dataset) {
      const orderDirection = this.maxValue ? 'desc' : 'asc';
      this.sta.getDatastreamObservationsRelation(
        this.dataset.url,
        this.dataset.id,
        { $orderby: `result ${orderDirection}`, $top: 1 }
      ).subscribe(res => {
        if (res.value.length === 1) {
          this.value = res.value[0].result;
          this.valueDate = new Date(res.value[0].phenomenonTime);
        }
      });
    }
  }

}
