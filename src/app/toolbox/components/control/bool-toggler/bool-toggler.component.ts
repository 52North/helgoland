import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'n52-bool-toggler',
    templateUrl: './bool-toggler.component.html'
})
export class BoolTogglerComponent {

    @Input()
    public value: boolean;

    @Input()
    public icon: string;

    @Input()
    public tooltip: string;

    @Output()
    public onToggled: EventEmitter<boolean> = new EventEmitter();

    constructor() { }

    public toggle() {
        this.onToggled.emit(!this.value);
    }
}
