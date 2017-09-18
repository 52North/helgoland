import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'n52-permalink-in-mail',
  templateUrl: './permalink-in-mail.component.html',
  styleUrls: ['./permalink-in-mail.component.scss']
})
export class PermalinkInMailComponent {

  @Input()
  public url: string;

  @Output()
  public onTriggered: EventEmitter<void> = new EventEmitter<void>();

  public openInMail() {
    window.location.href = 'mailto:?body=' + encodeURIComponent(this.url);
    this.onTriggered.emit();
  }

}
