import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'n52-permalink-new-window',
  templateUrl: './permalink-new-window.component.html',
  styleUrls: ['./permalink-new-window.component.scss']
})
export class PermalinkNewWindowComponent {

  @Input()
  public url: string;

  @Output()
  public onTriggered: EventEmitter<void> = new EventEmitter<void>();

  public openInNewWindow() {
    window.open(this.url, '_blank');
    this.onTriggered.emit();
  }

}
