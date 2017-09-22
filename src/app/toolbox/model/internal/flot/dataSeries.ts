export interface DataSeries extends jquery.flot.dataSeries, SeriesOptions {
    internalId: string;
    data: any[];
}

interface SeriesOptions extends jquery.flot.seriesOptions {
    selected: boolean;
}
