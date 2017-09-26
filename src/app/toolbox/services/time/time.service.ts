import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import * as moment from 'moment';
import { Duration } from 'moment';

import { BufferedTime, TimeInterval, Timespan } from './../../model/internal/time-interval';
import { LocalStorage } from './../local-storage/local-storage.service';

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
        const from = moment(timespan.from).subtract(duration).toDate();
        const to = moment(timespan.to).subtract(duration).toDate();
        return new Timespan(from, to);
    }

    public stepForward(timespan: Timespan): Timespan {
        const duration = this.getDuration(timespan);
        const from = moment(timespan.from).add(duration).toDate();
        const to = moment(timespan.to).add(duration).toDate();
        return new Timespan(from, to);
    }

    public overlaps(timeInterval: TimeInterval, from: Date, to: Date): boolean {
        const timespan = this.createTimespanOfInterval(timeInterval);
        if (timespan.from >= from && timespan.from <= to || timespan.to >= from && timespan.to <= to) {
            return true;
        }
        return false;
    }

    public createTimespanOfInterval(timeInterval: TimeInterval): Timespan {
        if (timeInterval instanceof Timespan) {
            return timeInterval;
        } else if (timeInterval instanceof BufferedTime) {
            throw new Error('not implemented yet');
        } else {
            console.error('Wrong time interval!');
        }
    }

    private getDuration(timespan: Timespan): Duration {
        const from = moment(timespan.from);
        const to = moment(timespan.to);
        return moment.duration(to.diff(from));
    }

    public getBufferedTimespan(timespan: Timespan, factor: number): Timespan {
        const durationMillis = this.getDuration(timespan).asMilliseconds();
        const from = moment(timespan.from).subtract(durationMillis * factor).toDate();
        const to = moment(timespan.to).add(durationMillis * factor).toDate();
        return new Timespan(from, to);
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
