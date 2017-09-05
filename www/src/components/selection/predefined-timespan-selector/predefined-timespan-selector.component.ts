import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Timespan } from '../../../model';
import { Settings } from '../../../services/settings/settings.service';

@Component({
    selector: 'n52-predefined-timespan-selector',
    templateUrl: './predefined-timespan-selector.component.html',
    styleUrls: ['./predefined-timespan-selector.component.scss']
})

export class PredefinedTimespanSelectorComponent implements OnInit {
    @Input()
    public timespan: Timespan;

    @Output()
    public onTimespanChange: EventEmitter<Timespan> = new EventEmitter<Timespan>();

    constructor(private settingSrvc: Settings) { }

    public ngOnInit() {
    }

    public timespanChanged(event) {
        // regex checks whether code to be eval'ed adhers to syntax given in https://momentjs.com/docs/#/manipulating/
        // explanation:                 Start with "moment()"   Possible functions: add(number, string) and subtract(number, string)                            Further possible functions: startOf(string) and endOf(string)                           Further possible functions: year(number), ..., milliseconds(number).                         functions can be chained infinitely, or not at all
        // further explanation:         This is a MUST.         The strings have to be out of the options described in the docs (shortcuts permitted)           Again, the strings have to be out of a strict set.                                      These set the corresponding part of the Moment object to the number given.                   |  (i.e. "moment()" is the minimal case matched)
        // even further explanation:                            The number doesn't HAVE to be reasonable (e.g. month=20 is ok), but that's no security issue.   The quotes can incorrectly start with ' and then end with " (or vice versa), but that's no security problem either.                                                                  v v optional semicolon at the end
        const isSafeMomentExpression = new RegExp(/^moment\(\)(\.((add|subtract)\(\d+, ?['"](years|y|quarters|Q|months|M|weeks|w|days|d|hours|h|minutes|m|seconds|s|milliseconds|ms)['"]\))|((startOf|endOf)\(['"](year|month|quarter|week|isoWeek|day|date|hour|minute|second)['"]\))|((year|month|date|hours|minutes|seconds|milliseconds)\(\d+\)))*;?$/);
        // brackets level in case you get lost:            * *1  23            3 *          3                                                                                      3     *2 23             3 *    3                                                           3     *2 23                                                  3 *    *21                        x
        // * = this bracket is an escaped bracket and therefore not counted

        // test both inputs against the regex
        if(isSafeMomentExpression.test(event.target.dataset.timespanFrom) && isSafeMomentExpression.test(event.target.dataset.timespanTo)) {
            // if satisfied, eval the inputs -> the ._d property contains the corresponding Date objects from which the Timespan can be constructed
            this.timespan = new Timespan(eval(event.target.dataset.timespanFrom)._d, eval(event.target.dataset.timespanTo)._d);
            // publicise new timestamp
            this.onTimespanChange.emit(this.timespan);
        }
    }
}
