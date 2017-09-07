import { Type } from 'class-transformer';

export class Timespan {

    @Type(() => Date)
    from: Date;

    @Type(() => Date)
    to: Date;

    constructor(from: Date, to: Date) {
        this.from = from;
        this.to = to;
    }
}
