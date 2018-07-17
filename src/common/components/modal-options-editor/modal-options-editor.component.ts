import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatasetOptions, MinMaxRange } from '@helgoland/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'n52-options-editor',
  templateUrl: './modal-options-editor.component.html',
  styleUrls: ['./modal-options-editor.component.scss']
})
export class ModalOptionsEditorComponent implements OnInit {

  @Input()
  public options: DatasetOptions;

  @Output()
  public out: EventEmitter<DatasetOptions> = new EventEmitter();

  public color: string;
  public generalize: boolean;
  public zeroBasedYAxis: boolean;
  public pointRadius: number;
  public lineWidth: number;
  public range: MinMaxRange;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    if (this.options) {
      this.generalize = this.options.generalize;
      this.zeroBasedYAxis = this.options.zeroBasedYAxis;
      this.pointRadius = this.options.pointRadius;
      this.lineWidth = this.options.lineWidth;
      this.range = this.options.yAxisRange;
    }
  }

  public rangeChanged(range: MinMaxRange) {
    this.range = range;
  }

  public updateOption() {
    if (this.color) { this.options.color = this.color; }
    this.options.generalize = this.generalize;
    this.options.zeroBasedYAxis = this.zeroBasedYAxis;
    this.options.pointRadius = this.pointRadius;
    this.options.lineWidth = this.lineWidth;
    this.options.yAxisRange = this.range;
    this.out.emit(this.options);
  }

}
