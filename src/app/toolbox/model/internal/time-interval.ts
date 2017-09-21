import { Type } from 'class-transformer';

export abstract class TimeInterval {

}

export class Timespan extends TimeInterval {

    @Type(() => Date)
    from: Date;

    @Type(() => Date)
    to: Date;

    constructor(from: Date, to: Date) {
        super();
        this.from = from;
        this.to = to;
    }
}

export class BufferedTime extends TimeInterval {
    timestamp: Date;
    bufferInterval: number;

    constructor(timestamp: Date, bufferInterval: number) {
        super();
        this.timestamp = timestamp;
        this.bufferInterval = bufferInterval;
    }
}
