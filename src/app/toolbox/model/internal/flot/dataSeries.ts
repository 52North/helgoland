interface SeriesOptions extends jquery.flot.seriesOptions {
    selected?: boolean;
}

export interface DataSeries extends jquery.flot.dataSeries, SeriesOptions {
    internalId: string;
    data: any[];
}
