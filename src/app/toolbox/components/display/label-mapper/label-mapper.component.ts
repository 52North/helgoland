import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { LabelMapperService } from './label-mapper.service';

@Component({
    selector: 'n52-label-mapper',
    templateUrl: './label-mapper.component.html'
})
export class LabelMapperComponent implements OnChanges {

    @Input()
    public label: string;

    public determinedLabel: string;

    public loading = true;

    constructor(
        private labelMapperSrvc: LabelMapperService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.label) {
            this.labelMapperSrvc.getMappedLabel(this.label)
                .subscribe((label) => {
                    this.determinedLabel = label;
                    this.loading = false;
                });
        } else {
            this.loading = false;
        }
    }
}
