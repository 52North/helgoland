import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatasetOptions } from '@helgoland/core';
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
  public zeroBasedYAxe: boolean;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    if (this.options) {
      this.generalize = this.options.generalize;
      this.zeroBasedYAxe = this.options.zeroBasedYAxe;
    }
  }

  public updateOption() {
    if (this.color) { this.options.color = this.color; }
    this.options.generalize = this.generalize;
    this.options.zeroBasedYAxe = this.zeroBasedYAxe;
    this.out.emit(this.options);
  }

}
