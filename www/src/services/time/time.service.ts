import { Injectable } from '@angular/core';
import { LocalStorage } from '../local-storage';
import { Timespan } from '../../model';
import { plainToClass } from 'class-transformer';
import * as moment from 'moment';
import { Duration } from 'moment';

@Injectable()
export class Time {

    constructor(
        private localStorage: LocalStorage
    ) { }

    public centerTimespan(timespan: Timespan, date: Date): Timespan {
        const halfduration = this.getDuration(timespan).asMilliseconds() / 2;
        const from = moment(date).subtract(halfduration).toDate();
        const to = moment(date).add(halfduration).toDate();
        return new Timespan(from, to);
    }

    public stepBack(timespan: Timespan): Timespan {
        const duration = this.getDuration(timespan);
        const from = moment(timespan.from).add(duration).toDate();
        const to = moment(timespan.to).add(duration).toDate();
        return new Timespan(from, to);
    }

    public stepForward(timespan: Timespan): Timespan {
        const duration = this.getDuration(timespan);
        const from = moment(timespan.from).subtract(duration).toDate();
        const to = moment(timespan.to).subtract(duration).toDate();
        return new Timespan(from, to);
    }

    private getDuration(timespan: Timespan): Duration {
        const from = moment(timespan.from);
        const to = moment(timespan.to);
        return moment.duration(to.diff(from));
    }

    public saveTimespan(param: string, timespan: Timespan) {
        this.localStorage.save(param, timespan);
    }

    public loadTimespan(param: string): Timespan {
        const json = this.localStorage.load(param);
        if (json) {
            return plainToClass<Timespan, object>(Timespan, json);
        }
        return null;
    }

    public initTimespan(): Timespan {
        const now = new Date();
        const start = moment(now).startOf('day').toDate();
        const end = moment(now).endOf('day').toDate();
        return new Timespan(start, end);
    }

}
