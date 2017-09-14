import { DataSeries } from './dataSeries';

export interface Plot extends jquery.flot.plot {
    setSelection(range: any, show: boolean): void;
    getData(): DataSeries[];
}
