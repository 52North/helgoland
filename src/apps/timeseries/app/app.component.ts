import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Component, ViewEncapsulation } from '@angular/core';
import { Language, Settings, SettingsService } from '@helgoland/core';
import { D3TimeFormatLocaleService } from '@helgoland/d3';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'n52-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  public languageList: Language[];

  constructor(
    private translate: TranslateService,
    private settings: SettingsService<Settings>,
    private d3translate: D3TimeFormatLocaleService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('de');

    // necessary to load information on e.g. what 'medium' date format should look like in German etc.
    registerLocaleData(localeDe);

    this.languageList = this.settings.getSettings().languages;

    this.d3translate.addTimeFormatLocale('de',
      {
        'dateTime': '%a %b %e %X %Y',
        'date': '%d-%m-%Y',
        'time': '%H:%M:%S',
        'periods': ['AM', 'PM'],
        'days': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        'shortDays': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        'months': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        'shortMonths': ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
      }
    );
  }
}
