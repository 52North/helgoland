import { Component, Input, OnInit } from '@angular/core';

import { LabelMapperService } from './label-mapper.service';

@Component({
    selector: 'n52-label-mapper',
    templateUrl: './label-mapper.component.html'
})
export class LabelMapperComponent implements OnInit {

    @Input()
    public label: string;

    public determinedLabel: string;

    public loading = true;

    constructor(
        private labelMapperSrvc: LabelMapperService
    ) { }

    public ngOnInit() {
        if (this.label) {
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
