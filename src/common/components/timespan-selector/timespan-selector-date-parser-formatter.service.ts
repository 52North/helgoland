import { Injectable } from "@angular/core";
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from '@ngx-translate/core';

function padNumber(value: number) {
    if (isNumber(value)) {
        return `0${value}`.slice(-2);
    } else {
        return "";
    }
}

function isNumber(value: any): boolean {
    return !isNaN(toInteger(value));
}

function toInteger(value: any): number {
    return parseInt(`${value}`, 10);
}


@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
    constructor(protected translate: TranslateService) {
        super();
      }

    parse(value: string): NgbDateStruct {
        if (value) {
            const dateParts = value.trim().split('/');
            if (dateParts.length === 1 && isNumber(dateParts[0])) {
                return {year: toInteger(dateParts[0]), month: null, day: null};
            } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
                return {year: toInteger(dateParts[1]), month: toInteger(dateParts[0]), day: null};
            } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
                return {year: toInteger(dateParts[2]), month: toInteger(dateParts[1]), day: toInteger(dateParts[0])};
            }
        }   
        return null;
    }

    format(date: NgbDateStruct): string {
        switch (this.translate.currentLang) {
            case 'de':
                return this.formatDE(date);
            default:
                return this.formatEN(date);
        }  
    }

    formatDE(date: NgbDateStruct): string{
        let stringDate: string = ""; 
        if(date) {
            stringDate += isNumber(date.day) ? padNumber(date.day) + "." : "";
            stringDate += isNumber(date.month) ? padNumber(date.month) + "." : "";
            stringDate += date.year;
        }
        return stringDate;
    }

    formatEN(date: NgbDateStruct): string{
        let stringDate: string = ""; 
        if(date) {
            stringDate += date.year + "-";
            stringDate += isNumber(date.month) ? padNumber(date.month) + "-" : "";
            stringDate += isNumber(date.day) ? padNumber(date.day) : "";  
        }
        return stringDate;
    }
}