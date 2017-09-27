import { HostListener } from '@angular/core';

export abstract class ResizableComponent {

    @HostListener('window:resize', ['$event'])
    protected onWindowResize() {
        this.onResize();
    }

    protected abstract onResize(): void;

}
