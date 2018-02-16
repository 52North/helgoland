import { Component } from '@angular/core';
import { PermalinkToClipboardComponent } from '@helgoland/permalink';

@Component({
  selector: 'n52-custom-permalink-to-clipboard',
  templateUrl: './to-clipboard.component.html',
  styleUrls: ['./to-clipboard.component.scss']
})
export class ToClipboardComponent extends PermalinkToClipboardComponent { }
