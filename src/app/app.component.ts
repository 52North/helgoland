import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'helgoland-toolbox/dist';

@Component({
  selector: 'n52-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public languageList: Language[];

  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('de');

    this.languageList = [
      {
        label: 'Deutsch',
        code: 'de'
      },
      {
        label: 'English',
        code: 'en'
      }
    ];

  }
}
