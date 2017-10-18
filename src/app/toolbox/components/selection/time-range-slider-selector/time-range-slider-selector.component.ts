import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Timespan } from 'helgoland-toolbox';

declare var $: any;

@Component({
    selector: 'n52-time-range-slider-selector',
    templateUrl: './time-range-slider-selector.component.html',
    styleUrls: ['./time-range-slider-selector.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TimeRangeSliderSelectorComponent implements OnChanges {

    @Input()
    public timeList: Array<number>;

    @Output()
    public onTimespanSelected: EventEmitter<Timespan> = new EventEmitter();

    public start: number;
    public selectionStart: number;
    public end: number;
    public selectionEnd: number;

    constructor() { }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.timeList && this.timeList) {
            let min, max;
            this.start = this.selectionStart = min = this.timeList[0];
            this.end = this.selectionEnd = max = this.timeList[this.timeList.length - 1];
            $('#slider').slider({
                tooltip: 'hide',
                min: min,
                max: max,
                value: [min, max]
            }).on('slideStop', (event: any) => {
                this.onTimespanSelected.emit(new Timespan(event.value[0], event.value[1]));
            }).on('slide', (event: any) => {
                this.selectionStart = event.value[0];
                this.selectionEnd = event.value[1];
            });
        }
    }
}
