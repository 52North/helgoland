import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Component } from '@angular/core';
import { Language, Settings, SettingsService } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'n52-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public languageList: Language[];

  constructor(
    translate: TranslateService,
    settings: SettingsService<Settings>
  ) {
    this.languageList = settings.getSettings().languages;

    if (this.languageList.length > 0) {
      const defaultLang = translate.getBrowserLang() || 'en';
      const foundLang = this.languageList.find(l => l.code === defaultLang);
      if (foundLang) {
        translate.use(foundLang.code);
      } else {
        translate.use(this.languageList[0].code);
      }

      // necessary to load information on e.g. what 'medium' date format should look like in German etc.
      registerLocaleData(localeDe);
    } else {
      console.error('Please check the language configuration in the settings. You must at least configured one language.');
    }

  }
}
