import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'n52-permalink-button',
  templateUrl: './permalink-button.component.html',
  styleUrls: ['./permalink-button.component.scss']
})
export class PermalinkButtonComponent {

  @ViewChild('permalinkModal')
  public modal: TemplateRef<any>;

  @Input()
  public generatedUrlFunction: Function;

  public permalinkUrl: string;

  constructor(
    private modalService: NgbModal
  ) { }

  public permalink() {
    this.permalinkUrl = this.generatedUrlFunction();
    this.modalService.open(this.modal);
  }

}
