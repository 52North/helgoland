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
  private    translate: TranslateService,
    private settings: SettingsService<Settings>
  ) {
    this.setLanguage();
    // necessary to load information on e.g. what 'medium' date format should look like in German etc.
    registerLocaleData(localeDe);
  }

  private setLanguage() {
    this.languageList = this.settings.getSettings().languages;
    // else choose browser language
    const browserLang = this.translate.getBrowserLang();
    if (this.settings.getSettings().languages.find(e => e.code === browserLang)) {
      this.translate.use(browserLang);
    } else {
      // else set first configured language
      this.translate.use(this.settings.getSettings().languages[0].code);
    }
  }
}
