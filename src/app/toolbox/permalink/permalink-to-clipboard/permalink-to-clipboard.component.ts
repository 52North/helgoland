import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'n52-permalink-to-clipboard',
  templateUrl: './permalink-to-clipboard.component.html',
  styleUrls: ['./permalink-to-clipboard.component.scss']
})
export class PermalinkToClipboardComponent {

  @Input()
  public url: string;

  @Output()
  public onTriggered: EventEmitter<void> = new EventEmitter<void>();

  public toClipboard() {
    window.prompt('', this.url);
    this.onTriggered.emit();
  }

}
