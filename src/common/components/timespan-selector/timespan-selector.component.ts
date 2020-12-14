import { Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
import { Timespan } from '@helgoland/core';
import { NgbDatepickerI18n, NgbDateStruct, NgbTimeStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CustomDateParserFormatter } from "./timespan-selector-date-parser-formatter.service"

type I18n_Dict = {[key: string]: any}

const I18N_VALUES: I18n_Dict = {
  'de': {
    weekdays: {
      short: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
      full: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']
    },
    months: {
      short: ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
      full: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    }
  },
  'en': {
    weekdays: {
      short: ['Mo', 'Tu', 'Wed', 'Thu', 'Fri', 'Sat', 'Su'],
      full: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    months: {
      short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      full: ['January', 'February', 'March', 'April', 'May', 'June', 'Jule', 'August', 'September', 'October', 'November', 'December'],
    }
  }
};

@Injectable()
export class LocalizedDatepickerI18n extends NgbDatepickerI18n {

  constructor(protected translate: TranslateService) {
    super();
    
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this.translate.currentLang]
      ? I18N_VALUES[this.translate.currentLang].weekdays.short[weekday - 1]
      : I18N_VALUES["en"].weekdays.short[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this.translate.currentLang]
      ? I18N_VALUES[this.translate.currentLang].months.short[month - 1]
      : I18N_VALUES["en"].months.short[month - 1];
  }
  getMonthFullName(month: number): string {
    return  I18N_VALUES[this.translate.currentLang]
      ? I18N_VALUES[this.translate.currentLang].months.full[month - 1]
      : I18N_VALUES["en"].months.full[month - 1];
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}

@Component({
  selector: 'n52-timespan-selector',
  templateUrl: './timespan-selector.component.html',
  styleUrls: ['./timespan-selector.component.scss'],
  providers: [{provide: NgbDatepickerI18n, useClass: LocalizedDatepickerI18n},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}]
})
export class TimespanSelectorComponent implements OnInit {

  @Input()
  public timespan: Timespan;

  @Output()
  public timespanChange: EventEmitter<Timespan> = new EventEmitter<Timespan>();

  @Output()
  public invalidTimespanSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

  public dateFrom: NgbDateStruct;
  public timeFrom: NgbTimeStruct;
  public dateTo: NgbDateStruct;
  public timeTo: NgbTimeStruct;
  public showErrorMessage = true;
  public isValidTimespan = true;

  public ngOnInit() {
    const from = new Date(this.timespan.from);
    const to = new Date(this.timespan.to);
    this.dateFrom = {
      year: from.getFullYear(), month: from.getMonth() + 1, day: from.getDate()
    };
    this.timeFrom = {
      hour: from.getHours(), minute: from.getMinutes(), second: from.getSeconds()
    };
    this.dateTo = {
      year: to.getFullYear(), month: to.getMonth() + 1, day: to.getDate()
    };
    this.timeTo = {
      hour: to.getHours(), minute: to.getMinutes(), second: to.getSeconds()
    };

    const dateTimeFrom = new Date(this.dateFrom.year, this.dateFrom.month - 1, this.dateFrom.day,
      this.timeFrom.hour, this.timeFrom.minute, this.timeFrom.second);
    const dateTimeTo = new Date(this.dateTo.year, this.dateTo.month - 1, this.dateTo.day,
      this.timeTo.hour, this.timeTo.minute, this.timeTo.second);

    this.validateTimespan(dateTimeFrom, dateTimeTo);
  }

  public timespanChanged() {
    const dateTimeFrom = new Date(this.dateFrom.year, this.dateFrom.month - 1, this.dateFrom.day,
      this.timeFrom.hour, this.timeFrom.minute, this.timeFrom.second);
    const dateTimeTo = new Date(this.dateTo.year, this.dateTo.month - 1, this.dateTo.day,
      this.timeTo.hour, this.timeTo.minute, this.timeTo.second);

      this.validateTimespan(dateTimeFrom, dateTimeTo);

    
  }

  public validateTimespan(dateTimeFrom: Date, dateTimeTo: Date){
    this.isValidTimespan = (dateTimeFrom < dateTimeTo);

    if (this.isValidTimespan) {
      this.showErrorMessage = false;
      this.timespan = new Timespan(dateTimeFrom.getTime(), dateTimeTo.getTime());
      this.timespanChange.emit(this.timespan);
      console.log(this.timespan);
    } else {
      this.showErrorMessage = true;
      this.invalidTimespanSelected.emit(true);
      console.log('Invalid timespan selected!');
    }
  }

}
