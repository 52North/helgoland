import { AxesOptions } from './axesOptions';

export interface PlotOptions extends jquery.flot.plotOptions {
    yaxes?: AxesOptions[];
    xaxis?: AxesOptions;
    yaxis?: AxesOptions;
    // selectedTimespan?: Timespan;
    selection?: {
        mode?: string;
        color?: string;
        shape?: string;
        minSize?: 30;
        range?: {
            from: number;
            to: number;
        }
    };
    annotation?: string;
    touch?: {
        pan?: string;
        scale?: string;
        delayTouchEnded?: number;
    };
    crosshair?: {
        mode?: string
    };
    pan?: {
        frameRate: number,
        interactive: boolean
    };
}
