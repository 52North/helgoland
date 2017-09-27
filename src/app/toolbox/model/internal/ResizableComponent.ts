import { HostListener } from '@angular/core';

export abstract class ResizableComponent {

    @HostListener('window:resize', ['$event'])
    private onResize() {
        this.onResizeWindow();
    }

    protected abstract onResizeWindow(): void;

}
