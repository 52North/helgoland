import { Component } from '@angular/core';
import { LocalSelectorComponent } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'n52-local-selector',
  templateUrl: './local-selector.component.html',
  styleUrls: ['./local-selector.component.scss']
})
export class LocalSelectorImplComponent extends LocalSelectorComponent {

  constructor(translate: TranslateService) {
    super(translate);
  }

}
