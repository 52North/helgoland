import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { NotifierService } from '@helgoland/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'n52-permalink-button',
  templateUrl: './permalink-button.component.html',
  styleUrls: ['./permalink-button.component.scss']
})
export class PermalinkButtonComponent {

  @ViewChild('permalinkModal', { static: true })
  public modal: TemplateRef<any>;

  @Input()
  public generatedUrlFunction: () => string;

  public permalinkUrl: string;

  constructor(
    private modalService: NgbModal,
    private translate: TranslateService,
    private notification: NotifierService
  ) { }

  public permalink() {
    this.permalinkUrl = this.generatedUrlFunction();
    this.modalService.open(this.modal);
  }

  public confirmClipboard() {
    this.translate.get('permalink.confirm-to-clipboard').subscribe(text => {
      this.notification.notify(text);
    });
  }

}
