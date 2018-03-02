import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'helgoland-toolbox/dist';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

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

    // necessary to load information on e.g. what 'medium' date format should look like in German etc.
    registerLocaleData(localeDe);

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
